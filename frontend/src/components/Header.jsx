// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const companies = [
    { name: 'Nestly', path: '/nestly' },
    { name: 'Whisk', path: '/whisk' },
    { name: 'PetSitHub', path: '/petsit' },
  ];

  const firstName = user?.name ? user.name.split(' ')[0] : '';

  return (
    <header className="header-container">
      <h1 className="header-title-container">
        <Link to="/" className="header-link" onClick={() => setIsMenuOpen(false)}>
          <span className="desktop-title">The Commons</span>
          <span className="mobile-title">TC</span>
        </Link>
      </h1>

      {/* Desktop Nav */}
      <nav className="header-nav desktop-only">
        <div 
          className="dropdown-container"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <button className="pixel-btn dropdown-trigger">
            Companies <span className="dropdown-arrow">▼</span>
          </button>
          
          <div className="dropdown-menu pixel-scroll">
            {companies.map((co) => (
              <Link 
                key={co.path} 
                to={co.path} 
                className="dropdown-item"
                onClick={() => setShowDropdown(false)}
              >
                {co.name}
              </Link>
            ))}
          </div>
        </div>

        {user ? (
          <div className="user-nav">
            <Link to={`/user/${user.id}`} className="user-profile-link">
              Welcome, {user.name}
            </Link>
            <button onClick={logout} className="pixel-btn logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="pixel-btn">Login</button>
        )}
      </nav>

      {/* Mobile Burger Menu */}
      <div className="mobile-only burger-wrapper">
        <button 
          className={`burger-icon ${isMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="burger-bar"></span>
          <span className="burger-bar"></span>
          <span className="burger-bar"></span>
        </button>

        {isMenuOpen && (
          <div className="mobile-menu-tray pixel-scroll">
            {user && (
              <Link 
                to={`/user/${user.id}`} 
                className="mobile-menu-item user-info"
                onClick={() => setIsMenuOpen(false)}
              >
                Welcome, {firstName}
              </Link>
            )}
            
            <div className="mobile-menu-section">
              <span className="mobile-menu-label">Companies</span>
              {companies.map((co) => (
                <Link 
                  key={co.path} 
                  to={co.path} 
                  className="mobile-menu-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {co.name}
                </Link>
              ))}
            </div>

            {user ? (
              <button 
                onClick={() => { logout(); setIsMenuOpen(false); }} 
                className="pixel-btn logout-btn mobile-logout"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={() => { navigate('/login'); setIsMenuOpen(false); }} 
                className="pixel-btn"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
