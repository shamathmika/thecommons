// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import Nestly from "./pages/Nestly";

import './styles/global.css'; 
import './styles/Home.css'; 

// Import assets
import homeBg from './assets/home_bg.png';
import greenGrass from './assets/green_grass.png';

function Home() {
  return (
    <div className="home-container">
      {/* Background Image managed via CSS variables */}
      <div 
        className="village-map-background" 
        style={{ 
          '--desktop-bg': `url(${homeBg})`,
          '--mobile-bg': `url(${greenGrass})`
        }}
      />
      
      {/* Village Sign Overlay */}
      <div className="pixel-card village-sign">
        <h2>The Village Map</h2>
        <p>Select a destination to visit</p>
      </div>
      
      {/* Interactive Spots */}
      <div className="map-interactables">
        
        {/* Nestly */}
        <a href="/nestly" className="house-link pos-nestly">
          <div className="house-label">Nestly</div>
        </a>

        {/* Whisk */}
        <a href="/whisk" className="house-link pos-whisk">
          <div className="house-label">Whisk</div>
        </a>

        {/* PetSitHub */}
        <a href="/petsit" className="house-link pos-petsit">
          <div className="house-label">PetSitHub</div>
        </a>

      </div>

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

            <Route path="/nestly" element={<Nestly />} />

            <Route path="/whisk" element={<div style={{padding: '2rem'}}>Whisk Page Coming Soon</div>} />
            <Route path="/petsit" element={<div style={{padding: '2rem'}}>PetSitHub Page Coming Soon</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
