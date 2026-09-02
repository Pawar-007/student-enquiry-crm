import { client } from './client'

export const batchApi = {
  create: (payload) => client.post('/batches', payload).then((r) => r.data),
  update: (id, payload) => client.patch(`/batches/${id}`, payload).then((r) => r.data),
  byCourse: (courseId) => client.get(`/batches/course/${courseId}`).then((r) => r.data),
  get: (id) => client.get(`/batches/${id}`).then((r) => r.data),
}
