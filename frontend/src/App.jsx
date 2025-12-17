// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import Nestly from "./pages/Nestly";
import Whisk from "./pages/Whisk";
import WhiskDetail from "./pages/WhiskDetail";

import './styles/global.css'; 
import './styles/Home.css'; 

// pixel village images
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
        <Link to="/nestly" className="map-building">
          <div className="building-wrapper">
            <img src={nestlyImg} alt="Nestly House" className="building-img" />
            <div className="pixel-btn visit-btn">Nestly</div>
          </div>
        </Link>

        {/* Whisk Bakery */}
        <Link to="/whisk" className="map-building map-building-whisk">
          <div className="building-wrapper">
            <img 
              src={whiskImg} 
              alt="Whisk Bakery" 
              className="building-img building-img-whisk" 
            />
            <div className="pixel-btn visit-btn">Whisk</div>
          </div>
        </Link>

        {/* PetSitHub Kennel */}
        <Link to="/petsit" className="map-building">
          <div className="building-wrapper">
            <img 
              src={petsitImg} 
              alt="PetSitHub" 
              className="building-img building-img-petsit" 
            />
            <div className="pixel-btn visit-btn">PetSitHub</div>
          </div>
        </Link>

      </div>
      
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

            <Route path="/nestly" element={<Nestly />} />
            <Route path="/whisk" element={<Whisk />} />
            <Route path="/whisk/:id" element={<WhiskDetail />} />
            
            <Route path="/petsit" element={<div style={{padding: '2rem'}}>PetSitHub Page Coming Soon</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
