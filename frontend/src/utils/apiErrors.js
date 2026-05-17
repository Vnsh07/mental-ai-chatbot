/**
 * Normalize FastAPI / axios error payloads for display.
 * @param {unknown} err
 * @param {string} fallback
 */
export function getApiErrorMessage(err, fallback = "Something went wrong.") {
  if (err?.code === "ERR_NETWORK" || err?.message === "Network Error") {
    return "Cannot reach the API. Check VITE_API_URL, that the backend is running, and CORS_ORIGINS on the server.";
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
