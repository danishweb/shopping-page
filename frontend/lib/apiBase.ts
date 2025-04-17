// This file manages the API base URL for different environments (local/dev/prod)

const isLocal = typeof window !== "undefined"
  ? window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  : process.env.NODE_ENV === "development";

// Use environment variable for production API URL
export const API_BASE = isLocal
  ? "http://localhost:4000"
  : process.env.NEXT_PUBLIC_API_BASE || "https://karini-be.vercel.app";

// Usage: fetch(`${API_BASE}/api/items`)
