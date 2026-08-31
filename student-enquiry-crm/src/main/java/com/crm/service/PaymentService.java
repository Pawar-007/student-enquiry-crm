package com.crm.service;

import com.crm.dto.response.PaymentResponseDTO;
import com.crm.entity.Payment;
import java.math.BigDecimal;
import java.util.List;

public interface PaymentService {

    PaymentResponseDTO addPayment(Payment payment);

    List<PaymentResponseDTO> getPaymentsByEnrollment(Integer enrollmentId);

    BigDecimal getPaidAmount(Integer enrollmentId);

    BigDecimal getPendingAmount(Integer enrollmentId);

    BigDecimal getTotalRevenue();
}