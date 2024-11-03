// src/pages/Destination.js
import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { useLocation } from 'react-router-dom';
import '../styles.css';

function Destination() {
    const location = useLocation();
    const { weatherData } = location.state; // Access the entire weather data object
    const globeEl = useRef();
    const [locationImage, setLocationImage] = useState("Placeholder"); // State to hold the image URL
    const [locationImageHtml, setLocationImageHtml] = useState("https://via.placeholder.com/1080x720?text=Image+Not+Found"); // State to hold the HTML link

    useEffect(() => {
        if (weatherData) {
            const { lat, lon, name } = weatherData.location;

            // Animate the globe to the target latitude and longitude
            globeEl.current.pointOfView({ lat, lng: lon, altitude: .5 }, 5000, () => {
                // After the initial animation, zoom in slightly
                setTimeout(() => {
                    globeEl.current.pointOfView({ lat, lng: lon, altitude: 1.2 }, 1000); // Adjust altitude for closer zoom
                }, 2000); // Delay zoom for 2 seconds after the initial animation
            });

            // Fetch town image from Unsplash
            fetchTownImage(name);
        }
    }, [weatherData]);

    // Function to fetch an image of the location
    const fetchTownImage = async (townName) => {
        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${townName}&client_id=DUCrY7EDe9dGKHY9Wxis0EeTOQ1Fp5XKiYAzCsU59js`
            );
            const data = await response.json();
            if (data.results.length > 0) {
                // Save the first image result
                const firstImage = data.results[0];
                setLocationImage(firstImage.urls.small); // Save the small image URL
                setLocationImageHtml(firstImage.links.html); // Save the HTML link for the image
            }
        } catch (error) {
            console.error("Error fetching town image:", error);
        }
    };

    return (
        <div className="destination-container">
            <h2>Traveling to Your Location...</h2>

            {/* Flex Container for Globe and Image */}
            <div className="globe-and-image-container">
                <div className="globe-animation">
                    <Globe
                        ref={globeEl}
                        width={600}
                        height={400}
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                        backgroundColor="rgba(0,0,0,0)"
                        pointsData={[{ lat: weatherData.location.lat, lng: weatherData.location.lon }]} // Red pinpoint marker data
                        pointAltitude={0.02}
                        pointColor={() => 'red'}
                    />
                </div>

                {/* Display Town Image */}
                {locationImage && (
                    <div className="location-image-container">
                        <h3>Image of {weatherData.location.name}:</h3>
                        <img
                            src={locationImage}
                            alt={`${weatherData.location.name}`}
                            className="location-image"
                            loading="lazy"
                        />
                        {/* Link to the Unsplash page for the image */}
                        <p>
                            View on <a href={locationImageHtml} target="_blank" rel="noopener noreferrer">Unsplash</a>
                        </p>
                    </div>
                )}
            </div>

            {/* Displaying Weather Data */}
            <div className="weather-data">
                <h3>Weather Details for {weatherData.location.name}, {weatherData.location.country}:</h3>
                <ul>
                    <li><strong>Condition:</strong> {weatherData.current.condition.text}</li>
                    <li><strong>Temperature:</strong> {weatherData.current.temp_f} °F</li>
                    <li><strong>Feels Like:</strong> {weatherData.current.feelslike_f} °F</li>
                    <li><strong>Humidity:</strong> {weatherData.current.humidity}%</li>
                    <li><strong>Wind Speed:</strong> {weatherData.current.wind_mph} mph</li>
                    <li><strong>Wind Direction:</strong> {weatherData.current.wind_dir}</li>
                    <li><strong>Cloud Coverage:</strong> {weatherData.current.cloud}%</li>
                    <li><strong>Precipitation:</strong> {weatherData.current.precip_in} inches</li>
                    <li><strong>Visibility:</strong> {weatherData.current.vis_miles} miles</li>
                    <li><strong>UV Index:</strong> {weatherData.current.uv}</li>
                </ul>
            </div>
        </div>
    );
}

export default Destination;
