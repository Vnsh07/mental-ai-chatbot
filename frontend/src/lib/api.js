import axios from "axios";
import { AUTH_STORAGE } from "../constants/authStorage";

function resolveBaseURL() {
  const configured = import.meta.env.VITE_API_URL;
  if (configured === undefined || configured === "") {
    return import.meta.env.DEV ? "" : "http://127.0.0.1:8000";
  }
  return String(configured).replace(/\/$/, "");
}

const baseURL = resolveBaseURL();

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 120000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_STORAGE.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url ?? "";
    if (err.response?.status === 401) {
      if (url.includes("/auth/login") || url.includes("/auth/signup")) {
        return Promise.reject(err);
      }
      localStorage.removeItem(AUTH_STORAGE.ACCESS_TOKEN);
      const path = window.location.pathname;
      if (!path.startsWith("/login") && !path.startsWith("/signup")) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(err);
  },
);
