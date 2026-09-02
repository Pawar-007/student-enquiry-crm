import { client } from './client'

export const courseApi = {
  create: (payload) => client.post('/courses', payload).then((r) => r.data),
  update: (id, payload) => client.patch(`/courses/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/courses/${id}`).then((r) => r.data),
  get: (id) => client.get(`/courses/${id}`).then((r) => r.data),
  list: () => client.get('/courses').then((r) => r.data),
  search: (name) => client.get('/courses/search', { params: { name } }).then((r) => r.data),
}
