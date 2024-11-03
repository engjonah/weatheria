// src/components/Navbar/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Gear1 from '../assets/gear1.svg';
import Gear2 from '../assets/gear2.svg';
import Gear3 from '../assets/gear3.svg';
import '../styles.css';

function Navbar() {
  const location = useLocation();

  // Array of gear images for variety
  const gears = [Gear1, Gear2, Gear3];

  // Number of gears needed to span the navbar width
  // Adjust this number based on your design and gear size
  const NUMBER_OF_GEARS = 40; // Increase if needed

  // Generate gear images dynamically
  const gearImages = Array.from({ length: NUMBER_OF_GEARS }, (_, index) => (
    <img
      key={index}
      src={gears[index % gears.length]}
      alt=""
      className="gear"
      aria-hidden="true"
    />
  ));

  return (
    <nav className="navbar">
      <div className="navbar-logo">Weatheria</div>
      <ul className="navbar-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        </li>
        <li>
          <Link to="/pick-weather" className={location.pathname === '/pick-weather' ? 'active' : ''}>Pick Weather</Link>
        </li>
        <li>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
        </li>
      </ul>

      {/* Decorative Gears Container within Navbar */}
      <div className="gears-container">
        {gearImages}
      </div>
    </nav>
  );
}

export default Navbar;
