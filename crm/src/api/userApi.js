import { client } from './client'

export const userApi = {
  create: (payload) => client.post('/users', payload).then((r) => r.data),
  update: (id, payload) => client.patch(`/users/${id}`, payload).then((r) => r.data),
  block: (id) => client.patch(`/users/${id}/block`).then((r) => r.data),
  unblock: (id) => client.patch(`/users/${id}/unblock`).then((r) => r.data),
  get: (id) => client.get(`/users/${id}`).then((r) => r.data),
  listCounsellors: () => client.get('/users/counsellors').then((r) => r.data),
  listActiveCounsellors: () => client.get('/users/counsellors/active').then((r) => r.data),
}
