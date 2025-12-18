// src/App.jsx
import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import Header from "./components/Header";
import Login from "./pages/Login";
import CompanyPage from "./pages/CompanyPage";
import ProductDetail from "./pages/ProductDetail";
import UserProfile from "./pages/UserProfile";

import "./styles/global.css";
import "./styles/Home.css";
import "./styles/Modal.css";

import homeBg from './assets/home_bg.png';
import greenGrass from './assets/green_grass.png';
import greenGrassHorizontal from './assets/green_grass_horizontal.png';

import nestlyImg from "./assets/nestly.png";
import whiskImg from "./assets/whisk.png";
import petsitImg from "./assets/petsithub.png";
import avatar1 from "./assets/1.png";
import avatar2 from "./assets/2.png";
import avatar3 from "./assets/3.png";
import avatar4 from "./assets/4.png";
import avatar5 from "./assets/5.png";


import ProductCard from "./components/ProductCard";

const apiBase = import.meta.env.VITE_API_BASE || "/backend";

function Home() {
  const [topProducts, setTopProducts] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [topError, setTopError] = useState("");

  // TESTIMONIALS
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const carouselRef = useRef(null);

  // Avatar mapping
  const avatarMap = [avatar1, avatar2, avatar3, avatar4, avatar5];

  // Load overall marketplace top 5
  useEffect(() => {
    async function fetchTopProducts() {
      try {
        const res = await fetch(`${apiBase}/marketplace/products/top.php`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const items = Array.isArray(data.top)
          ? data.top
          : Array.isArray(data)
          ? data
          : [];

        setTopProducts(items);
      } catch (err) {
        console.error("Failed to load top marketplace products", err);
        setTopError("Failed to load top marketplace products.");
      } finally {
        setLoadingTop(false);
      }
    }

    fetchTopProducts();
  }, []);

  // Load testimonials
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch(`${apiBase}/marketplace/users/testimonials.php`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (Array.isArray(data)) {
          setTestimonials(data);
        } else {
          setTestimonials([]);
        }
      } catch (err) {
        console.error("Failed to load testimonials", err);
      } finally {
        setLoadingTestimonials(false);
      }
    }

    fetchTestimonials();
  }, []);

  // Auto-scroll for testimonials
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let scrollAmount = 1;

    const interval = setInterval(() => {
      el.scrollLeft += scrollAmount;

      if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
        el.scrollLeft = 0; // reset loop
      }
    }, 30);

    // Pause on hover
    const stop = () => (scrollAmount = 0);
    const resume = () => (scrollAmount = 1);

    el.addEventListener("mouseenter", stop);
    el.addEventListener("mouseleave", resume);

    return () => {
      clearInterval(interval);
      el.removeEventListener("mouseenter", stop);
      el.removeEventListener("mouseleave", resume);
    };
  }, [testimonials]);

  return (
    <div
      className="home-container"
      style={{ '--grass-tiling': `url(${greenGrassHorizontal})` }}
    >
      {/* === HERO SECTION === */}
      <div className="hero-section">
        <div
          className="village-map-background"
          style={{
            '--desktop-bg': `url(${homeBg})`,
            '--mobile-bg': `url(${greenGrass})`,
          }}
        />

        <div className="pixel-card village-sign">
          <h2>The Village Map</h2>
          <p>Select a destination to visit</p>
          <Link to="/marketplace" className="pixel-btn view-all-btn">
            See the Entire Marketplace
          </Link>
        </div>

        <div className="map-interactables">
          <Link to="/nestly" className="house-link pos-nestly">
            <img src={nestlyImg} className="mobile-house-icon" />
            <div className="house-label">Nestly</div>
          </Link>

          <Link to="/whisk" className="house-link pos-whisk">
            <img src={whiskImg} className="mobile-house-icon" />
            <div className="house-label">Whisk</div>
          </Link>

          <Link to="/petsit" className="house-link pos-petsit">
            <img src={petsitImg} className="mobile-house-icon" />
            <div className="house-label">PetSitHub</div>
          </Link>
        </div>
      </div>

      <div className="road-path" />

      {/* === TOP 5 PICKS === */}
      <section className="top-section">
        <h2 className="pixel-font top-title">Top 5 Picks in The Commons</h2>
        <p className="top-subtitle">Based on ratings & visits village-wide.</p>

        {loadingTop && <p>Loading...</p>}
        {topError && <p style={{ color: "red" }}>{topError}</p>}

        {!loadingTop && !topError && topProducts.length > 0 && (
          <div className="top-grid">
            {topProducts.map((p) => {
              let detailLink =
                p.company === "whisk"
                  ? `/whisk/${p.id}`
                  : p.company === "nestly"
                  ? `/nestly/${p.id}`
                  : `/petsit/${p.id}`;

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

      {/* === VILLAGE VOICES TESTIMONIALS === */}
      <section className="top-section" style={{ marginTop: "2rem" }}>
        <h2 className="pixel-font top-title">Village Voices</h2>
        <p className="top-subtitle">Stories from your fellow villagers</p>

        {loadingTestimonials && <p>Gathering villager stories...</p>}

        {!loadingTestimonials && testimonials.length === 0 && (
          <p>No testimonials yet. Be the first to share a village memory!</p>
        )}

        {!loadingTestimonials && testimonials.length > 0 && (
          <div className="testimonial-carousel" ref={carouselRef}>
            {testimonials.map((t) => {
              const avatar = avatarMap[t.id % 5];

              return (
                <div key={t.id} className="pixel-card testimonial-card">
                  <div className="testimonial-row">
                    <img
                      src={avatar}
                      className="testimonial-avatar"
                      alt="villager avatar"
                    />
                    <div className="testimonial-body">
                      <h3 className="pixel-font testimonial-name">{t.name}</h3>
                      <p className="testimonial-text">"{t.review}"</p>
                    </div>
                  </div>
                </div>
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
      <ModalProvider>
        <Router>
          <div className="app-wrapper">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/nestly" element={<CompanyPage company="nestly" />} />
              <Route path="/nestly/:id" element={<ProductDetail />} />
              <Route path="/whisk" element={<CompanyPage company="whisk" />} />
              <Route path="/whisk/:id" element={<ProductDetail />} />
              <Route path="/petsit" element={<CompanyPage company="petsit" />} />
              <Route path="/petsit/:id" element={<ProductDetail />} />
              <Route path="/marketplace" element={<CompanyPage company="marketplace" />} />
              <Route path="/user/:id" element={<UserProfile />} />
            </Routes>
          </div>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
