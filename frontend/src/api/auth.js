// src/api/auth.js
const API_ROOT = import.meta.env.VITE_API_BASE || "/backend";
const API_BASE = `${API_ROOT}/marketplace/auth`;

export async function login(email, password) {
  const response = await fetch(`${API_BASE}/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // so PHP sessions work (localhost + prod)
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function register(name, email, password) {
  const response = await fetch(`${API_BASE}/register.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_BASE}/logout.php`, {
    method: "POST",
    credentials: "include",
  });
  return response.json();
}

export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE}/me.php`, {
      credentials: "include",
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.user ?? null;
  } catch (_) {
    return null;
  }
}