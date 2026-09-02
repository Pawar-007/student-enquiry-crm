import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api'

export const client = axios.create({
  baseURL: BASE_URL,
})

// Attach JWT to every outgoing request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Global 401/403 handling: clear session and bounce to /login
let onAuthFailure = () => {}
export function registerAuthFailureHandler(fn) {
  onAuthFailure = fn
}

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 403) {
      localStorage.removeItem('crm_token')
      localStorage.removeItem('crm_user')
      onAuthFailure()
    }
    return Promise.reject(error)
  }
)

// Normalizes the backend's error envelope into a single readable string,
// plus keeps validationErrors around for per-field form errors.
export function parseApiError(error) {
  const data = error?.response?.data
  if (data?.message) {
    return { message: data.message, validationErrors: data.validationErrors || null }
  }
  if (error?.message) return { message: error.message, validationErrors: null }
  return { message: 'Something went wrong. Please try again.', validationErrors: null }
}
