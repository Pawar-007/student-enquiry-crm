import apiClient from './apiClient';

// FollowupRequestDTO
export function createFollowup(payload) {
  return apiClient.post('/followups', payload).then((res) => res.data);
}

export function completeFollowup(id, { outcome, remarks }) {
  return apiClient
    .patch(`/followups/${id}/complete`, null, { params: { outcome, remarks } })
    .then((res) => res.data);
}

export function getFollowupsByEnquiry(enquiryId) {
  return apiClient.get(`/followups/enquiry/${enquiryId}`).then((res) => res.data);
}

export function getTodaysFollowups() {
  return apiClient.get('/followups/today').then((res) => res.data);
}

export function getFollowupsByCounsellor(counsellorId) {
  return apiClient.get(`/followups/counsellor/${counsellorId}`).then((res) => res.data);
}
