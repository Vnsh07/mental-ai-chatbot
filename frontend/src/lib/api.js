import axios from "axios";
import { AUTH_STORAGE } from "../constants/authStorage";

/** Render API — override with VITE_API_URL in Vercel if your service URL differs. */
const DEFAULT_PRODUCTION_API = "https://mental-ai-chatbot.onrender.com";

function resolveBaseURL() {
  const raw = import.meta.env.VITE_API_URL;
  const configured = raw === undefined || raw === null ? "" : String(raw).trim();

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  if (import.meta.env.DEV) {
    return "";
  }

  return DEFAULT_PRODUCTION_API;
}

export const apiBaseURL = resolveBaseURL();

const baseURL = apiBaseURL;

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
