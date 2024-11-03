// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PickWeather from './pages/PickWeather';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Decorative Gears */}
        <img src="/gear-left.svg" alt="Gear Left" className="gear gear-left" />
        <img src="/gear-right.svg" alt="Gear Right" className="gear gear-right" />

        <Navbar />

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pick-weather" element={<PickWeather />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
