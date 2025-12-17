// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

// Keep API base handling consistent with auth.js
const API_ROOT = import.meta.env.VITE_API_BASE || "/backend";

function Login() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let result;

    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(
        formData.name,
        formData.email,
        formData.password
      );
      if (result.success) {
        alert("Registered! Please login.");
        setIsLogin(true);
        return;
      }
    }

    if (result.success) {
      window.location.href = "/";
    } else {
      setError(result.error || "Operation failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_ROOT}/marketplace/auth/google-start.php`;
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "2rem auto", textAlign: "center" }}
    >
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <button type="submit">{isLogin ? "Sign In" : "Sign Up"}</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "1rem" }}>
        <p>Or</p>
        <button
          onClick={handleGoogleLogin}
          style={{ backgroundColor: "#DB4437", color: "white" }}
        >
          Sign in with Google
        </button>
      </div>

      <p style={{ marginTop: "1rem" }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register" : "Login"}
        </span>
      </p>
    </div>
  );
}

export default Login;
