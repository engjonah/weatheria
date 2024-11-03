// src/pages/Home/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import SteampunkButton from '../components/SteampunkButton';
import SteampunkDevice from '../assets/device.png';
import '../styles.css';

function Home() {
  return (
    <div className="home-container">
      <h2 className="home-heading">Welcome to Weatheria</h2>
      <p className="home-text">
        Find where you're 'controlling' the weather with your desired weather conditions through our sleek and intuitive interface.
      </p>
      <img src={SteampunkDevice} alt="Weatheria Device" className="home-image" loading="lazy" />
      <div className="button-container">
        <Link to="/pick-weather">
          <SteampunkButton>
            <i className="fas fa-search"></i> Start Now
          </SteampunkButton>
        </Link>
      </div>
    </div>
  );
}

export default Home;
