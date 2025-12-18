// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Login from "./pages/Login";
import Nestly from "./pages/Nestly";
import Whisk from "./pages/Whisk";
import ProductDetail from "./pages/ProductDetail";

import "./styles/global.css";
import "./styles/Home.css";

// pixel village images
import homeBg from './assets/home_bg.png';
import greenGrass from './assets/green_grass.png';
import nestlyImg from "./assets/nestly.png";
import whiskImg from "./assets/whisk.png";
import petsitImg from "./assets/petsithub.png";

import ProductCard from "./components/ProductCard";

const apiBase = import.meta.env.VITE_API_BASE || "/backend";

function Home() {
  const [topProducts, setTopProducts] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [topError, setTopError] = useState("");

  // Load overall marketplace top 5
  useEffect(() => {
    async function fetchTopProducts() {
      try {
        const res = await fetch(`${apiBase}/marketplace/products/top.php`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        if (data && Array.isArray(data.top)) {
          setTopProducts(data.top);
        } else if (Array.isArray(data)) {
          // fallback if backend ever just returns an array
          setTopProducts(data);
        } else {
          setTopProducts([]);
        }
      } catch (err) {
        console.error("Failed to load top marketplace products", err);
        setTopError("Failed to load top marketplace products.");
      } finally {
        setLoadingTop(false);
      }
    }

    fetchTopProducts();
  }, []);

  return (
    <div
      className="home-container"
      style={{
        '--grass-tiling': `url(${greenGrass})`,
      }}
    >
      
      {/* Hero Section: Map (Desktop) / List (Mobile) */}
      <div className="hero-section">
        {/* Background handled by CSS to switch between home_bg.png and green_grass.png */}
        <div 
          className="village-map-background" 
          style={{ 
            '--desktop-bg': `url(${homeBg})`,
            '--mobile-bg': `url(${greenGrass})`
          }}
        />

        {/* Village Sign */}
        <div className="pixel-card village-sign">
          <h2>The Village Map</h2>
          <p>Select a destination to visit</p>
        </div>
        
        {/* Interactive Spots */}
        <div className="map-interactables">
          
          {/* Nestly */}
          <Link to="/nestly" className="house-link pos-nestly">
            <img src={nestlyImg} alt="" className="mobile-house-icon" />
            <div className="house-label">Nestly</div>
          </Link>

          {/* Whisk */}
          <Link to="/whisk" className="house-link pos-whisk">
            <img src={whiskImg} alt="" className="mobile-house-icon" />
            <div className="house-label">Whisk</div>
          </Link>

          {/* PetSitHub */}
          <Link to="/petsit" className="house-link pos-petsit">
            <img src={petsitImg} alt="" className="mobile-house-icon" />
            <div className="house-label">PetSitHub</div>
          </Link>

        </div>
      </div>

      {/* Road Path Divider (optional visual) */}
      <div className="road-path"></div>

      {/* === Top 5 Marketplace Section === */}
      <section className="top-section">
        <h2 className="pixel-font top-title">Top 5 Picks in The Commons</h2>
        <p className="top-subtitle">
          Based on 70% rating and 30% visit count across all companies.
        </p>

        {loadingTop && <p>Loading top products...</p>}
        {topError && <p style={{ color: "red" }}>{topError}</p>}

        {!loadingTop && !topError && topProducts.length === 0 && (
          <p>No products available yet.</p>
        )}

        {!loadingTop && !topError && topProducts.length > 0 && (
          <div className="top-grid">
            {topProducts.map((p) => {
              let detailLink = "/";

              if (p.company === "whisk") {
                detailLink = `/whisk/${encodeURIComponent(p.id)}`;
              } else if (p.company === "nestly") {
                detailLink = `/nestly/${encodeURIComponent(p.id)}`; // Assuming detail page exists or goes to list
              } else if (p.company === "petsit") {
                detailLink = "/petsit";
              }

              return (
                <Link
                  key={`${p.company}-${p.id}`}
                  to={detailLink}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ProductCard product={p} />
                </Link>
              );
            })}
          </div>
        )}
      </section>
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
            <Route path="/nestly/:id" element={<ProductDetail />} />

            <Route path="/whisk" element={<Whisk />} />
            <Route path="/whisk/:id" element={<ProductDetail />} />

            <Route
              path="/petsit"
              element={
                <div style={{ padding: "2rem" }}>
                  PetSitHub Page Coming Soon
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
