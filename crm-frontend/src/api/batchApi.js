import apiClient from './apiClient';

// BatchRequestDTO { courseId, batchName, startDate, endDate, timing, status }
export function createBatch(payload) {
  return apiClient.post('/batches', payload).then((res) => res.data);
}

export function updateBatch(id, payload) {
  return apiClient.patch(`/batches/${id}`, payload).then((res) => res.data);
}

export function getBatchesByCourse(courseId) {
  return apiClient.get(`/batches/course/${courseId}`).then((res) => res.data);
}

export function getBatchById(id) {
  return apiClient.get(`/batches/${id}`).then((res) => res.data);
}
