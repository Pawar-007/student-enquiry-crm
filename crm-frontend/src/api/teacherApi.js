import apiClient from './apiClient';

// TeacherRequestDTO { name, email, mobile, expertise }
export function createTeacher(payload) {
  return apiClient.post('/teachers', payload).then((res) => res.data);
}

export function updateTeacher(id, payload) {
  return apiClient.patch(`/teachers/${id}`, payload).then((res) => res.data);
}

export function deleteTeacher(id) {
  return apiClient.delete(`/teachers/${id}`).then((res) => res.data);
}

export function getTeacherById(id) {
  return apiClient.get(`/teachers/${id}`).then((res) => res.data);
}

export function getTeachers() {
  return apiClient.get('/teachers').then((res) => res.data);
}
