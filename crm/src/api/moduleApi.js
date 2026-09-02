import { client } from './client'

export const moduleApi = {
  create: (payload) => client.post('/modules', payload).then((r) => r.data),
  update: (id, payload) => client.patch(`/modules/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/modules/${id}`).then((r) => r.data),
  byCourse: (courseId) => client.get(`/modules/course/${courseId}`).then((r) => r.data),
}
