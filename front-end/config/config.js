const rawBaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8000";
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");

export const config = {
    BASE_URL: normalizedBaseUrl.endsWith("/api")
        ? normalizedBaseUrl
        : `${normalizedBaseUrl}/api`,
};
