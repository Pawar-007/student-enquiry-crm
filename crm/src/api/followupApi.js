import { client } from './client'

export const followupApi = {
  create: (payload) => client.post('/followups', payload).then((r) => r.data),
  complete: (id, outcome, remarks) =>
    client.patch(`/followups/${id}/complete`, null, { params: { outcome, remarks } }).then((r) => r.data),
  byEnquiry: (enquiryId) => client.get(`/followups/enquiry/${enquiryId}`).then((r) => r.data),
  today: () => client.get('/followups/today').then((r) => r.data),
  byCounsellor: (id) => client.get(`/followups/counsellor/${id}`).then((r) => r.data),
}
