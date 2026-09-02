import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../../api/dashboardApi'

export function useAdminDashboard() {
  return useQuery({ queryKey: ['dashboard', 'admin'], queryFn: dashboardApi.admin })
}
