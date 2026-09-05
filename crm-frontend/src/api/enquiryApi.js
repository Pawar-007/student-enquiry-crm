import apiClient from './apiClient';

export function getAllEnquiries() {
  return apiClient.get('/enquiries').then((res) => 
    {
      return res.data;
    }
    );
}

export function getUnassignedEnquiries() {
  return apiClient.get('/enquiries/unassigned').then((res) =>{
  console.log("unassign enquiry",res.data);
  return res.data
});
}

export function getEnquiriesByStatus(status) {
  return apiClient.get(`/enquiries/status/${status}`).then((res) => res.data);
}

export function getEnquiryById(id) {
  return apiClient.get(`/enquiries/${id}`).then((res) => res.data);
}

// EnquiryRequestDTO (counsellor/admin created)
export function createEnquiry(payload) {
  return apiClient.post('/enquiries', payload).then((res) => res.data);
}

export function updateEnquiryStatus(id, status) {
  return apiClient.patch(`/enquiries/${id}/status`, null, { params: { status } }).then((res) => res.data);
}

export function updateEnquiryPriority(id, priority) {
  return apiClient.patch(`/enquiries/${id}/priority`, null, { params: { priority } }).then((res) => res.data);
}

export function assignEnquiryCounsellor(id, counsellorId) {
  return apiClient.patch(`/enquiries/${id}/assign`, null, { params: { counsellorId } }).then((res) => res.data);
}

export function getEnquiriesByCounsellor(counsellorId) {
  return apiClient.get(`/enquiries/counsellor/${counsellorId}`).then((res) => res.data);
}

export function getMyEnquiries() {
  return apiClient.get('/enquiries/my').then((res) => res.data);
}

// PUBLIC — POST /api/public/enquiries — PublicEnquiryRequestDTO
export function submitPublicEnquiry(payload) {
  return apiClient.post('/public/enquiries', payload).then((res) => res.data);
}
