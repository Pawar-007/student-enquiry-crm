import { client } from './client'

export const teacherApi = {
  create: (payload) => client.post('/teachers', payload).then((r) => r.data),
  update: (id, payload) => client.patch(`/teachers/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/teachers/${id}`).then((r) => r.data),
  get: (id) => client.get(`/teachers/${id}`).then((r) => r.data),
  list: () => client.get('/teachers').then((r) => r.data),
}
