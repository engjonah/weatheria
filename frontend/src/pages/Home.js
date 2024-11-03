// src/pages/Home/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import SteampunkButton from '../components/SteampunkButton';

function Home() {
  return (
    <div className="home-container">
      <h2 className="home-heading">Welcome to Weatheria DApp</h2>
      <p className="home-text">
        Discover locations with your desired weather conditions through our sleek and intuitive interface.
      </p>
      <img src="/steampunk-device.png" alt="Weatheria Device" className="home-image" loading="lazy" />
      <Link to="/pick-weather">
        <SteampunkButton>
          <i className="fas fa-search"></i> Start Now
        </SteampunkButton>
      </Link>
    </div>
  );
}

export default Home;
