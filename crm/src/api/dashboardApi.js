import { client } from './client'

export const dashboardApi = {
  admin: () => client.get('/dashboard/admin').then((r) => r.data),
}
