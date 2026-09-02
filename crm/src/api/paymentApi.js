import { client } from './client'

export const paymentApi = {
  create: (payload) => client.post('/payments', payload).then((r) => r.data),
  byEnrollment: (id) => client.get(`/payments/enrollment/${id}`).then((r) => r.data),
  paidByEnrollment: (id) => client.get(`/payments/enrollment/${id}/paid`).then((r) => r.data),
  pendingByEnrollment: (id) => client.get(`/payments/enrollment/${id}/pending`).then((r) => r.data),
  revenue: () => client.get('/payments/revenue').then((r) => r.data),
}
