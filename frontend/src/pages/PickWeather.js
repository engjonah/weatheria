// src/pages/PickWeather/PickWeather.js
import React, { useState } from 'react';
import SteampunkButton from '../components/SteampunkButton';

function PickWeather() {
  const [locationImage, setLocationImage] = useState(null);
  const [temperature, setTemperature] = useState(20);
  const [conditions, setConditions] = useState('Clear');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    process.env.NODE_ENV === 'production'
      ? window.location.origin
      : 'http://localhost:3000';

  const fetchLocationImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/weather-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperature, conditions }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch location image.');
      }

      const data = await response.json();
      setLocationImage(data.image_url);
    } catch (err) {
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
          fetchLocationImage();
        }}
      >
        <div className="pickweather-form-group">
          <label htmlFor="temperature" className="pickweather-label">
            Temperature (°C):
          </label>
          <input
            id="temperature"
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="pickweather-input"
            required
            min="-50"
            max="50"
            aria-label="Temperature in Celsius"
          />
        </div>
        <div className="pickweather-form-group">
          <label htmlFor="conditions" className="pickweather-label">
            Weather Condition:
          </label>
          <input
            id="conditions"
            type="text"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            className="pickweather-input"
            required
            placeholder="e.g., Clear, Rain, Snow"
            aria-label="Weather Condition"
          />
        </div>
        <SteampunkButton type="submit">
          {loading ? 'Searching...' : <><i className="fas fa-search"></i> Find Location</>}
        </SteampunkButton>
        {error && <p className="error-message">{error}</p>}
      </form>

      {locationImage && (
        <div className="pickweather-image-container">
          <h3 className="pickweather-subheading">
            <i className="fas fa-map-marker-alt"></i> Location Found!
          </h3>
          <img
            src={locationImage}
            alt="Generated location"
            className="pickweather-image"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

export default PickWeather;
