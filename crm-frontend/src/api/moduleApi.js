import apiClient from './apiClient';

// CourseModuleRequestDTO { courseId, moduleName, moduleOrder, duration }
export function createModule(payload) {
  return apiClient.post('/modules', payload).then((res) => res.data);
}

export function updateModule(id, payload) {
  return apiClient.patch(`/modules/${id}`, payload).then((res) => res.data);
}

export function deleteModule(id) {
  return apiClient.delete(`/modules/${id}`).then((res) => res.data);
}

export function getModulesByCourse(courseId) {
  return apiClient.get(`/modules/course/${courseId}`).then((res) => res.data);
}
