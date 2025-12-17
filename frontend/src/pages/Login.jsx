// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

// Keep API base handling consistent
const API_ROOT = import.meta.env.VITE_API_BASE || '/backend';

function Login() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.name, formData.email, formData.password);
      if (result.success) {
        alert('Registered! Please login.');
        setIsLogin(true);
        return;
      }
    }

    if (result.success) {
      window.location.href = '/'; 
    } else {
      setError(result.error || 'Operation failed');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_ROOT}/marketplace/auth/google-start.php`;
  };
  
  const handleFacebookLogin = () => {
    window.location.href = `${API_ROOT}/marketplace/auth/facebook-start.php`;
  };

  return (
    <div className="container login-page-container">
      <div className="pixel-card login-card">
        <h2 className="login-title">
          {isLogin ? 'Member Login' : 'New Villager'}
        </h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <input 
              type="text" 
              className="pixel-input"
              placeholder="Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          )}
          <input 
            type="email" 
            className="pixel-input"
            placeholder="Email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="password" 
            className="pixel-input"
            placeholder="Password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          
          <button type="submit" className="pixel-btn login-submit-btn">
            {isLogin ? 'Enter' : 'Join'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="oauth-section">
          <p className="oauth-label">Or use your traveler pass:</p>
          <div className="oauth-buttons">
            <button onClick={handleGoogleLogin} className="pixel-btn google-btn">
              Sign in with Google
            </button>
            <button onClick={handleFacebookLogin} className="pixel-btn facebook-btn">
              Sign in with Facebook
            </button>
          </div>
        </div>

        <p className="toggle-auth-msg">
          {isLogin ? "New to the village? " : "Already established? "}
          <span 
            className="toggle-auth-link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
