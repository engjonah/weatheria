// src/pages/PickWeather/PickWeather.js
import React, { useState } from 'react';
import SteampunkButton from '../components/SteampunkButton';
import Vial from '../components/Vial';
import Knob from '../components/Knob';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import './PickWeather.css'; // Ensure this file exists

const PickWeatherContainer = styled.div`
  background: url('/images/steampunk-background.jpg') no-repeat center center;
  background-size: cover;
  padding: 50px;
  color: #f5f5dc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FormGroup = styled.div`
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

function PickWeather() {
  const navigate = useNavigate();
  const [conditions, setConditions] = useState('Clear');
  const [feelslikeF, setFeelslikeF] = useState(70);
  const [humidity, setHumidity] = useState(50);
  const [windMph, setWindMph] = useState(10);
  const [cloud, setCloud] = useState(50);
  const [precipIn, setPrecipIn] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response = null;
      response = await fetch('https://z3s2s5l67norlebmaspj3c3ro40dqkba.lambda-url.us-west-2.on.aws/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weatherData: { 
            current: {
                condition: { text: conditions },
                wind_mph: windMph,
                precip_in: precipIn,
                humidity: humidity,
                cloud: cloud,
                feelslike_f: feelslikeF
            }
        }}),
      });

      if (!response.ok) {
        //horrible retry logic: 
        response = await fetch('https://z3s2s5l67norlebmaspj3c3ro40dqkba.lambda-url.us-west-2.on.aws/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ weatherData: { 
              current: {
                  condition: { text: conditions },
                  wind_mph: windMph,
                  precip_in: precipIn,
                  humidity: humidity,
                  cloud: cloud,
                  feelslike_f: feelslikeF
              }
          }}),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      navigate('/destination', { state: { weatherData: data } });
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PickWeatherContainer className="pickweather-container">
      <h2 className="pickweather-heading">Reverse Controlling</h2>
      <form
        className="pickweather-form"
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
      >
        <FormGroup>
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
        </FormGroup>

        <FormGroup>
          <Vial
            label="Feels Like (°F)"
            value={feelslikeF}
            color="#ff6347" // Tomato
            onChange={setFeelslikeF}
            unit={'°F'}
          />
        </FormGroup>

        <FormGroup>
          <Vial
            label="Humidity (%)"
            value={humidity}
            color="#1e90ff" // DodgerBlue
            onChange={setHumidity}
            unit={'%'}
          />
        </FormGroup>

        <FormGroup>
          <Knob
            label="Wind Speed (mph)"
            value={windMph}
            onChange={setWindMph}
            min={0}
            max={250}
            step={1}
            unit={'mph'}
          />
        </FormGroup>

        <FormGroup>
          <Vial
            label="Cloud Cover (%)"
            value={cloud}
            color="#d3d3d3" // LightGray
            onChange={setCloud}
            unit={'%'}
          />
        </FormGroup>

        <FormGroup>
          <Vial
            label="Precipitation (in)"
            value={precipIn}
            color="#00ced1" // DarkTurquoise
            onChange={setPrecipIn}
            unit={' in'}
          />
        </FormGroup>

        <SteampunkButton type="submit">
          {loading ? 'Searching...' : <><i className="fas fa-search"></i> Find Location</>}
        </SteampunkButton>
        {error && <p className="error-message">{error}</p>}
      </form>
    </PickWeatherContainer>
  );
}

export default PickWeather;
