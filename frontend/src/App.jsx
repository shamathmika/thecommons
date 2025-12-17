// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import './App.css'; // Keep the CSS import if you want some base styles

// Placeholder Home Component
function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Welcome to the Marketplace</h2>
      <p>Explore listings from Nestly, Whisk, and PetSitHub.</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
        <a href="/nestly" style={cardStyle}>Nestly (Housing)</a>
        <a href="/whisk" style={cardStyle}>Whisk (Bakery)</a>
        <a href="/petsit" style={cardStyle}>PetSitHub (Pets)</a>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: '2rem',
  border: '1px solid #ddd',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#333',
  fontWeight: 'bold',
  display: 'block',
  minWidth: '150px'
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
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
