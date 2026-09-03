import axios from 'axios'

// Standalone axios instance for the public marketing site.
// Deliberately does NOT reuse `client` from ./client.js — public endpoints
// never require (and must never send) a JWT.
const BASE_URL = 'http://localhost:8080/api'

const publicClient = axios.create({
  baseURL: BASE_URL,
})

export function getPublicCourses() {
  return publicClient.get('/public/courses').then((r) => r.data)
}

export function getPublicCourseById(id) {
  return publicClient.get(`/public/courses/${id}`).then((r) => r.data)
}

export function submitPublicEnquiry(payload) {
  return publicClient.post('/public/enquiries', payload).then((r) => r.data)
}
