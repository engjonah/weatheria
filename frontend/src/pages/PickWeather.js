// src/pages/PickWeather/PickWeather.js
import React, { useState } from 'react';
import SteampunkButton from '../components/SteampunkButton';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function PickWeather() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [conditions, setConditions] = useState('Clear');
  const [feelslikeF, setFeelslikeF] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [windMph, setWindMph] = useState(0);
  const [cloud, setCloud] = useState(0);
  const [precipIn, setPrecipIn] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
        const response = await fetch('https://z3s2s5l67norlebmaspj3c3ro40dqkba.lambda-url.us-west-2.on.aws/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ weatherData: { 
                current: {
                    condition: { text: conditions }, // Use the current condition state
                    wind_mph: windMph, // Use the actual wind speed variable
                    precip_in: precipIn, // Use the actual precipitation variable
                    humidity: humidity, // Use the actual humidity variable
                    cloud: cloud, // Use the actual cloud coverage variable
                    feelslike_f: feelslikeF // Use the actual feels like variable
                }
            }}),
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get error response body
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        //console.log(data)

        // Navigate to a new route after successfully fetching
        navigate('/destination', { state: { weatherData: data } }); // Pass the entire data object
    } catch (err) {
        console.error('Fetch error:', err); // Log the error for debugging
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="pickweather-container">
      <h2 className="pickweather-heading">Reverse Weather Search</h2>
      <form
        className="pickweather-form"
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
      >
        <div className="pickweather-form-group">
          <label htmlFor="conditions" className="pickweather-label">
            Weather Condition:
          </label>
          <select
            id="conditions"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            className="pickweather-input"
            required
            aria-label="Weather Condition"
          >
            {[
              'Blizzard',
              'Blowing snow',
              'Clear',
              'Cloudy',
              'Fog',
              'Freezing fog',
              'Heavy freezing drizzle',
              'Heavy rain',
              'Heavy rain at times',
              'Heavy snow',
              'Light drizzle',
              'Light freezing rain',
              'Light rain',
              'Light rain shower',
              'Light sleet',
              'Light sleet showers',
              'Light snow',
              'Light snow showers',
              'Mist',
              'Moderate or heavy rain in area with thunder',
              'Moderate or heavy rain shower',
              'Moderate or heavy rain with thunder',
              'Moderate or heavy snow showers',
              'Moderate rain',
              'Moderate rain at times',
              'Moderate snow',
              'Overcast',
              'Partly Cloudy',
              'Partly cloudy',
              'Patchy heavy snow',
              'Patchy light drizzle',
              'Patchy light rain',
              'Patchy light rain in area with thunder',
              'Patchy light rain with thunder',
              'Patchy light snow',
              'Patchy moderate snow',
              'Patchy rain nearby',
              'Patchy rain possible',
              'Patchy sleet nearby',
              'Sunny',
              'Thundery outbreaks in nearby',
              'Thundery outbreaks possible',
              'Torrential rain shower'
            ].map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>
        <div className="pickweather-form-group">
          <label htmlFor="feelslikeF" className="pickweather-label">
            Feels Like (°F):
          </label>
          <input
            id="feelslikeF"
            type="number"
            value={feelslikeF}
            onChange={(e) => setFeelslikeF(parseFloat(e.target.value) || 0)}
            className="pickweather-input"
            required
            min="-50"
            max="150"
            aria-label="Feels like temperature in Fahrenheit"
          />
        </div>
        <div className="pickweather-form-group">
          <label htmlFor="humidity" className="pickweather-label">
            Humidity (%):
          </label>
          <input
            id="humidity"
            type="number"
            value={humidity}
            onChange={(e) => setHumidity(parseInt(e.target.value) || 0)}
            className="pickweather-input"
            required
            min="0"
            max="100"
            aria-label="Humidity percentage"
          />
        </div>
        <div className="pickweather-form-group">
          <label htmlFor="windMph" className="pickweather-label">
            Wind Speed (mph):
          </label>
          <input
            id="windMph"
            type="number"
            value={windMph}
            onChange={(e) => setWindMph(parseFloat(e.target.value) || 0)}
            className="pickweather-input"
            required
            min="0"
            max="250"
            aria-label="Wind Speed in mph"
          />
        </div>
        <div className="pickweather-form-group">
          <label htmlFor="cloud" className="pickweather-label">
            Cloud Cover (%):
          </label>
          <input
            id="cloud"
            type="number"
            value={cloud}
            onChange={(e) => setCloud(parseInt(e.target.value) || 0)}
            className="pickweather-input"
            required
            min="0"
            max="100"
            aria-label="Cloud cover percentage"
          />
        </div>
        <div className="pickweather-form-group">
          <label htmlFor="precipIn" className="pickweather-label">
            Precipitation (in):
          </label>
          <input
            id="precipIn"
            type="number"
            value={precipIn}
            onChange={(e) => setPrecipIn(parseFloat(e.target.value) || 0)}
            className="pickweather-input"
            required
            min="0"
            max="100"
            aria-label="Precipitation in inches"
          />
        </div>

        <SteampunkButton type="submit">
          {loading ? 'Searching...' : <><i className="fas fa-search"></i> Find Location</>}
        </SteampunkButton>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default PickWeather;
