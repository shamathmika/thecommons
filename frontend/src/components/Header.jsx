// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const companies = [
    { name: 'Nestly', path: '/nestly' },
    { name: 'Whisk', path: '/whisk' },
    { name: 'PetSitHub', path: '/petsit' },
  ];

  return (
    <header className="header-container">
      <h1 className="header-title-container">
        <Link to="/" className="header-link">The Commons</Link>
      </h1>

      <nav className="header-nav">
        {/* Companies Dropdown */}
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
    </header>
  );
}

export default Header;
