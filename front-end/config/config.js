const frontendOrigin = typeof window !== "undefined" ? window.location.origin : "";
const defaultBaseUrl = frontendOrigin.includes("react-nike-frontend.onrender.com")
    ? "https://react-nike-backend.onrender.com"
    : "http://localhost:8000";
const rawBaseUrl = import.meta.env.VITE_BASE_URL || defaultBaseUrl;
const normalizedBaseUrl = rawBaseUrl
    .replace("react-nike-frontend.onrender.com", "react-nike-backend.onrender.com")
    .replace(/\/+$/, "");

export const config = {
    BASE_URL: normalizedBaseUrl.endsWith("/api")
        ? normalizedBaseUrl
        : `${normalizedBaseUrl}/api`,
};
