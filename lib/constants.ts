// Application Constants

export const APP_NAME = "LogiFlow";
export const APP_DESCRIPTION =
  "Enterprise Logistics & Delivery Management System";

// API Configuration
export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api";
export const API_TIMEOUT = 30000;

// Feature Flags
export const ENABLE_IMPERSONATION =
  process.env.NEXT_PUBLIC_ENABLE_IMPERSONATION === "true";
export const ENABLE_EMERGENCY_OVERRIDE =
  process.env.NEXT_PUBLIC_ENABLE_EMERGENCY_OVERRIDE === "true";

// Session Configuration
export const SESSION_STORAGE_KEY = "session";
export const SESSION_COOKIE_KEY = "session";
export const SESSION_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Cache Configuration
export const CACHE_STALE_TIME = 5 * 60 * 1000; // 5 minutes
export const CACHE_REFETCH_INTERVAL = 10 * 60 * 1000; // 10 minutes

// Routes
export const PUBLIC_ROUTES = ["/", "/login"];
export const PROTECTED_ROUTES = ["/dashboard"];

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You are not authorized to perform this action",
  NOT_FOUND: "The requested resource was not found",
  SERVER_ERROR: "An error occurred on the server. Please try again later",
  NETWORK_ERROR: "Network error. Please check your connection",
  SESSION_EXPIRED: "Your session has expired. Please login again",
} as const;

