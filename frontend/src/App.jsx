// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import './styles/global.css'; // Import global styles
import './styles/Home.css'; // Import Home styles

// Import assets
import nestlyImg from './assets/nestly.png';
import whiskImg from './assets/whisk.png';
import petsitImg from './assets/petsithub.png';

function Home() {
  return (
    <div className="home-container">
      
      {/* Village Sign */}
      <div className="pixel-card village-sign">
        <h2>The Village Map</h2>
        <p>Select a destination to visit</p>
      </div>
      
      {/* Map Layout */}
      <div className="map-layout">
        
        {/* Nestly House */}
        <a href="/nestly" className="map-building">
          <div className="building-wrapper">
            <img src={nestlyImg} alt="Nestly House" className="building-img" />
            <div className="pixel-btn visit-btn">Nestly</div>
          </div>
        </a>

        {/* Whisk Bakery */}
        <a href="/whisk" className="map-building map-building-whisk">
          <div className="building-wrapper">
             <img src={whiskImg} alt="Whisk Bakery" className="building-img building-img-whisk" />
             <div className="pixel-btn visit-btn">Whisk</div>
          </div>
        </a>

        {/* PetSitHub Kennel */}
        <a href="/petsit" className="map-building">
          <div className="building-wrapper">
             <img src={petsitImg} alt="PetSitHub" className="building-img building-img-petsit" />
             <div className="pixel-btn visit-btn">PetSitHub</div>
          </div>
        </a>

      </div>
      
      {/* Decoration: Road/Path */}
      <div className="road-path"></div>

    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
