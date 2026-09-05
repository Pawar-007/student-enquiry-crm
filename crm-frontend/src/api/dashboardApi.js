import apiClient from './apiClient';

// GET /api/dashboard/admin -> DashboardResponseDTO
export function getAdminDashboard() {
  return apiClient.get('/dashboard/admin').then((res) => res.data);
}
