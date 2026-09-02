import { client } from './client'

export const enrollmentApi = {
  confirmAdmission: (payload) => client.post('/enrollments/confirm-admission', payload).then((r) => r.data),
  updateStatus: (id, status) => client.patch(`/enrollments/${id}/status`, null, { params: { status } }).then((r) => r.data),
  byStudent: (studentId) => client.get(`/enrollments/student/${studentId}`).then((r) => r.data),
  get: (id) => client.get(`/enrollments/${id}`).then((r) => r.data),
}
