// frontend/src/api/http.js
import axios from "axios";

/**
 * Base URL: use env if provided, otherwise default to your local backend.
 * Example .env (frontend):
 *   REACT_APP_API_BASE=/api
 */
const BASE_URL = process.env.REACT_APP_API_BASE || "/api";

const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // we use Bearer tokens, not cookies
});

// Attach JWT from localStorage (set during login)
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// Optional: simple 401 handler
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Optionally: redirect to login or clear token
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

/**
 * Helper you can call after login/logout to update storage.
 *   setAuthToken(token)  -> stores token
 *   setAuthToken(null)   -> removes token
 */
export function setAuthToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export { BASE_URL };
export default http;
