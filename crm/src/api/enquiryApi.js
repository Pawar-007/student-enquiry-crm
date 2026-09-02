import { client } from './client'

export const enquiryApi = {
  create: (payload) => client.post('/enquiries', payload).then((r) => r.data),
  updateStatus: (id, status) => client.patch(`/enquiries/${id}/status`, null, { params: { status } }).then((r) => r.data),
  assign: (id, counsellorId) => client.patch(`/enquiries/${id}/assign`, null, { params: { counsellorId } }).then((r) => r.data),
  updatePriority: (id, priority) => client.patch(`/enquiries/${id}/priority`, null, { params: { priority } }).then((r) => r.data),
  get: (id) => client.get(`/enquiries/${id}`).then((r) => r.data),
  my: () => client.get('/enquiries/my').then((r) => r.data),
  all: () => client.get('/enquiries').then((r) => r.data),
  unassigned: () => client.get('/enquiries/unassigned').then((r) => r.data),
  byStatus: (status) => client.get(`/enquiries/status/${status}`).then((r) => r.data),
  byCounsellor: (id) => client.get(`/enquiries/counsellor/${id}`).then((r) => r.data),
}
