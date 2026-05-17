/**
 * Normalize FastAPI / axios error payloads for display.
 * @param {unknown} err
 * @param {string} fallback
 */
import { apiBaseURL } from "../lib/api";

export function getApiErrorMessage(err, fallback = "Something went wrong.") {
  if (err?.code === "ERR_NETWORK" || err?.message === "Network Error") {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "your frontend";
    return (
      `Cannot reach the API at ${apiBaseURL || "(not configured)"}. ` +
      `On Render, set CORS_ORIGINS (and/or CORS_ORIGIN_REGEX) to include ${origin}. ` +
      `On Vercel, set VITE_API_URL to your Render URL and redeploy.`
    );
  }
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item.msg === "string") return item.msg;
        return String(item);
      })
      .join(" ");
  }
  if (detail && typeof detail === "object" && typeof detail.message === "string") {
    return detail.message;
  }
  if (err?.message && typeof err.message === "string") {
    return err.message;
  }
  return fallback;
}
