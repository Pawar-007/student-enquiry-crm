import apiClient from './apiClient';

// EnrollmentRequestDTO { enquiryId, courseId, totalFees, batchId? }
export function confirmAdmission(payload) {
  return apiClient.post('/enrollments/confirm-admission', payload).then((res) => res.data);
}

export function updateEnrollmentStatus(id, status) {
  return apiClient.patch(`/enrollments/${id}/status`, null, { params: { status } }).then((res) => res.data);
}

export function getEnrollmentsByStudent(studentId) {
  return apiClient.get(`/enrollments/student/${studentId}`).then((res) => res.data);
}

export function getEnrollmentById(id) {
  return apiClient.get(`/enrollments/${id}`).then((res) => res.data);
}
