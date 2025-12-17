// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

function Header() {
  const { user, logout } = useAuth();

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  return (
    <header className="header-container">
      <h1 className="header-title-container">
        <a href="/" className="header-link">The Commons</a>
      </h1>
      <nav>
        {user ? (
          <div className="user-nav">
            <span>Welcome, {user.name}</span>
            <button onClick={logout} className="pixel-btn logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={handleLoginRedirect} className="pixel-btn">Login</button>
        )}
      </nav>
    </header>
  );
}

export default Header;
