// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Login from "./pages/Login";
import Nestly from "./pages/Nestly";
import Whisk from "./pages/Whisk";
import WhiskDetail from "./pages/WhiskDetail";

import "./styles/global.css";
import "./styles/Home.css";

// pixel village images
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
                // We have detail pages for Whisk
                detailLink = `/whisk/${encodeURIComponent(p.id)}`;
              } else if (p.company === "nestly") {
                // Send Nestly items to Nestly page for now
                detailLink = "/nestly";
              } else if (p.company === "petsit") {
                // Placeholder for PetSitHub
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

            <Route path="/whisk" element={<Whisk />} />
            <Route path="/whisk/:id" element={<WhiskDetail />} />

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
