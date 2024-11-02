const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Weather = require('../models/Weather.model');
const { Console } = require('console');
require('dotenv').config();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const fetchWeatherData = async () => {
    const cities = [];
  
    // Read cities from CSV file
    fs.createReadStream('cities.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row.city) {
          cities.push(row.city);
        } else {
          console.error('Received an empty city name from CSV');
        }
      })
      .on('end', async () => {
        console.log("CSV file successfully processed.");
        for (const city of cities) {
          try {
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`);
  
            // Check if the response is ok
            if (!response.ok) {
              console.error(`Failed to fetch weather data for ${city}: ${response.statusText}`);
              continue; // Skip to the next city if there's an error
            }
  
            const weatherData = await response.json();
  
            // Check for error in the response
            if (weatherData.error) {
              console.error(`Error fetching weather data for ${city}: ${weatherData.error.message}`);
              continue; // Skip to the next city if an error occurred
            }
  
            // Find existing weather data for the city and delete it
            await Weather.deleteOne({ 'location.name': weatherData.location.name });
            console.log(`Deleted previous record for ${city} if it existed.`);
  
            // Proceed to save new weather data to MongoDB
            const weatherEntry = new Weather({
              location: {
                name: weatherData.location.name,
                region: weatherData.location.region,
                country: weatherData.location.country,
                lat: weatherData.location.lat,
                lon: weatherData.location.lon,
                tz_id: weatherData.location.tz_id,
                localtime_epoch: weatherData.location.localtime_epoch,
                localtime: weatherData.location.localtime,
              },
              current: {
                last_updated: weatherData.current.last_updated,
                temp_f: weatherData.current.temp_f,
                is_day: weatherData.current.is_day,
                condition: {
                  text: weatherData.current.condition.text,
                  icon: weatherData.current.condition.icon,
                  code: weatherData.current.condition.code,
                },
                wind_mph: weatherData.current.wind_mph,
                wind_dir: weatherData.current.wind_dir,
                precip_in: weatherData.current.precip_in,
                humidity: weatherData.current.humidity,
                cloud: weatherData.current.cloud,
                feelslike_f: weatherData.current.feelslike_f,
                windchill_f: weatherData.current.windchill_f,
                dewpoint_f: weatherData.current.dewpoint_f,
                vis_miles: weatherData.current.vis_miles,
                uv: weatherData.current.uv,
                gust_mph: weatherData.current.gust_mph,
              },
            });
  
            await weatherEntry.save();
            console.log(`Weather data for ${city} saved to MongoDB.`);
          } catch (error) {
            console.error(`Error fetching weather data for ${city}:`, error);
          }
        }
      });
  };
  
models.export = { fetchWeatherData }