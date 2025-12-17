// src/components/Header.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  const handleLoginRedirect = () => {
    // You can switch this to React Router later if you want
    window.location.href = "/login";
  };

  return (
    <header
      style={{
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1>The Commons</h1>
      <nav>
        {user ? (
          <div>
            <span>Welcome, {user.name}</span>
            <button onClick={logout} style={{ marginLeft: "1rem" }}>
              Logout
            </button>
          </div>
        ) : (
          <button onClick={handleLoginRedirect}>Login</button>
        )}
      </nav>
    </header>
  );
}

export default Header;
