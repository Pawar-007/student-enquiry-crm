import apiClient from './apiClient';

export function getPublicCourses() {
  return apiClient.get('/public/courses').then((res) => res.data);
}

export function getPublicCourseById(id) {
  return apiClient.get(`/public/courses/${id}`).then((res) => res.data);
}

export function getCourses() {
  return apiClient.get('/courses').then((res) => res.data);
}

export function getCourseById(id) {
  return apiClient.get(`/courses/${id}`).then((res) => res.data);
}

export function searchCourses(name) {
  return apiClient.get('/courses/search', { params: { name } }).then((res) => res.data);
}

// CourseRequestDTO { courseName, description, duration, fees, brochurePdf }
export function createCourse(payload) {
  return apiClient.post('/courses', payload).then((res) => res.data);
}

export function updateCourse(id, payload) {
  return apiClient.patch(`/courses/${id}`, payload).then((res) => res.data);
}

export function deleteCourse(id) {
  return apiClient.delete(`/courses/${id}`).then((res) => res.data);
}
