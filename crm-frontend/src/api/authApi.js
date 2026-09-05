import apiClient from './apiClient';

// POST /api/auth/login -> LoginResponseDTO { token, email, role }
export function login({ email, password }) {
  return apiClient.post('/auth/login', { email, password }).then((res) => res.data);
}
