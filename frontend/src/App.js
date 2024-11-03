import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PickWeather from './pages/PickWeather';
import About from './pages/About';
import Destination from './pages/Destination';
import './styles.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />

        <main className="content"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pick-weather" element={<PickWeather />} />
            <Route path="/about" element={<About />} />
            <Route path="/destination" element={<Destination />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
