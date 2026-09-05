import axios from 'axios';

// Base URL MUST come from env — never hardcode the backend host anywhere else.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  // Fail loud in dev so a missing .env doesn't silently break every request.
  // eslint-disable-next-line no-console
  console.warn(
    'VITE_API_BASE_URL is not set. Create a .env file from .env.example.'
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ledger_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Track a single logout handler the AuthProvider registers itself.
let onUnauthorized = null;
export function registerUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

// Normalize backend ErrorResponseDTO into a predictable shape and handle
// global auth failures (expired / invalid JWT) in one place.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    if (status === 401 || status === 403) {
      if (onUnauthorized) onUnauthorized(status);
    }

    const normalized = {
      status: status ?? 0,
      error: data?.error ?? 'Request Failed',
      message: data?.message ?? (error.message || 'Something went wrong. Please try again.'),
      path: data?.path,
      validationErrors: data?.validationErrors ?? null,
      timestamp: data?.timestamp,
    };

    return Promise.reject(normalized);
  }
);

export default apiClient;
