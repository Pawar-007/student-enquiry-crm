import apiClient from './apiClient';

export function getCounsellors() {
  return apiClient.get('/users/counsellors').then((res) => res.data);
}

export function getActiveCounsellors() {
  return apiClient.get('/users/counsellors/active').then((res) => res.data);
}

// UserRequestDTO { name, email, password, role, mobile }
export function createUser(payload) {
  return apiClient.post('/users', payload).then((res) => res.data);
}

export function updateUser(id, payload) {
  return apiClient.put(`/users/${id}`, payload).then((res) => res.data);
}

export function blockUser(id) {
  return apiClient.patch(`/users/${id}/block`).then((res) => res.data);
}

export function unblockUser(id) {
  return apiClient.patch(`/users/${id}/unblock`).then((res) => res.data);
}

export function getUserById(id) {
  return apiClient.get(`/users/${id}`).then((res) => res.data);
}
