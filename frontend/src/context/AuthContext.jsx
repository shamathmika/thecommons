// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, ask backend who is logged in (if anyone)
  useEffect(() => {
    let isMounted = true;

    authApi.getCurrentUser().then((u) => {
      if (!isMounted) return;
      setUser(u);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const result = await authApi.login(email, password);
    if (result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error || "Login failed" };
  };

  const register = async (name, email, password) => {
    const result = await authApi.register(name, email, password);
    if (!result.error) {
      // you can auto-login here if you want, but keeping it simple:
      return { success: true };
    }
    return { success: false, error: result.error || "Registration failed" };
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
