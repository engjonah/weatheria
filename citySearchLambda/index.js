const mongoose = require('mongoose');

// MongoDB connection string
const uri = 'mongodb+srv://nff4:1vDKolX685OdO05p@weatheriadb.smcfz.mongodb.net/?retryWrites=true&w=majority&appName=WeatheriaDB';

// Define a schema and model
const weatherSchema = new mongoose.Schema({
  location: {
    name: String,
    region: String,
    country: String,
    lat: Number,
    lon: Number,
    tz_id: String,
    localtime_epoch: Number,
    localtime: String,
  },
  current: {
    last_updated: String,
    temp_f: Number,
    is_day: Number,
    condition: {
      text: String,
      icon: String,
      code: Number,
    },
    wind_mph: Number,
    wind_dir: String,
    precip_in: Number,
    humidity: Number,
    cloud: Number,
    feelslike_f: Number,
    windchill_f: Number,
    dewpoint_f: Number,
    vis_miles: Number,
    uv: Number,
    gust_mph: Number,
  },
});

const WeatherModel = mongoose.model('Weather', weatherSchema);

exports.handler = async (event) => {
    console.log("Lambda function triggered");

    try {
        // Connect to MongoDB
        await mongoose.connect(uri);

        if (event.queryStringParameters && event.queryStringParameters.city) {
            // If the request is for a city, fetch weather data by city name
            const city = event.queryStringParameters.city;
            console.log("City requested:", city);
            const data = await WeatherModel.findOne({ "location.name": city }); // Modify the query as needed
            console.log(JSON.stringify(data));
            return {
                statusCode: 200,
                body: JSON.stringify(data),
            };
        } else if (event.body) {
            console.log("no url params");
            // If the request body contains weather data, process it
            const requestBody = JSON.parse(event.body);
            const weatherData = requestBody.weatherData;
            const rangeIncrement = 2; // Initial increment for the range

            let range = rangeIncrement;
            let result = [];

            // Loop to keep searching with an expanding range until a match is found
            while (result.length === 0) {
                result = await WeatherModel.aggregate([
                    {
                        $match: {
                            'current.condition.text': weatherData.current.condition.text,
                        },
                    },
                    {
                        $match: {
                            'current.wind_mph': { $gte: weatherData.current.wind_mph - range, $lte: weatherData.current.wind_mph + range },
                            'current.precip_in': { $gte: weatherData.current.precip_in - range, $lte: weatherData.current.precip_in + range },
                            'current.humidity': { $gte: weatherData.current.humidity - range, $lte: weatherData.current.humidity + range },
                            'current.cloud': { $gte: weatherData.current.cloud - range, $lte: weatherData.current.cloud + range },
                            'current.feelslike_f': { $gte: weatherData.current.feelslike_f - range, $lte: weatherData.current.feelslike_f + range },
                        },
                    },
                    {
                        $addFields: {
                            distance: {
                                $add: [
                                    { $abs: { $subtract: ['$current.wind_mph', weatherData.current.wind_mph] } },
                                    { $abs: { $subtract: ['$current.precip_in', weatherData.current.precip_in] } },
                                    { $abs: { $subtract: ['$current.humidity', weatherData.current.humidity] } },
                                    { $abs: { $subtract: ['$current.cloud', weatherData.current.cloud] } },
                                    { $abs: { $subtract: ['$current.feelslike_f', weatherData.current.feelslike_f] } },,
                                ],
                            },
                        },
                    },
                    { $sort: { distance: 1 } },
                    { $limit: 1 },
                ]);

                if (result.length === 0) {
                    range += rangeIncrement;
                }
            }

            return {
                statusCode: 200,
                body: JSON.stringify(result[0]),
            };
        } else {
            console.log("invalid request")
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid request. Please provide a city or weather data." }),
            };
        }
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    } finally {
        // Disconnect from the database
        await mongoose.disconnect();
    }
};

exports.handler({})