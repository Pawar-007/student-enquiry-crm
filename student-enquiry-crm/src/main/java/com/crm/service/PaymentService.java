package com.crm.service;

import com.crm.dto.request.PaymentRequestDTO;
import com.crm.dto.response.PaymentResponseDTO;
import java.math.BigDecimal;
import java.util.List;

public interface PaymentService {

    PaymentResponseDTO addPayment(PaymentRequestDTO dto);

    List<PaymentResponseDTO> getPaymentsByEnrollment(Integer enrollmentId);

    BigDecimal getPaidAmount(Integer enrollmentId);

    BigDecimal getPendingAmount(Integer enrollmentId);

    BigDecimal getTotalRevenue();
}