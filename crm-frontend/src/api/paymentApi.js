import apiClient from './apiClient';

// PaymentRequestDTO { enrollmentId, amount, paymentMethod, transactionReference, remarks }
export function createPayment(payload) {
  return apiClient.post('/payments', payload).then((res) => res.data);
}

export function getPaymentsByEnrollment(enrollmentId) {
  return apiClient.get(`/payments/enrollment/${enrollmentId}`).then((res) => res.data);
}

export function getPaidAmount(enrollmentId) {
  return apiClient.get(`/payments/enrollment/${enrollmentId}/paid`).then((res) => res.data);
}

export function getPendingAmount(enrollmentId) {
  return apiClient.get(`/payments/enrollment/${enrollmentId}/pending`).then((res) => res.data);
}

export function getRevenue() {
  return apiClient.get('/payments/revenue').then((res) => res.data);
}
