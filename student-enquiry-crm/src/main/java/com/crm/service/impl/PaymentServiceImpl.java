package com.crm.service.impl;

import com.crm.dto.request.PaymentRequestDTO;
import com.crm.dto.response.PaymentResponseDTO;
import com.crm.entity.Enrollment;
import com.crm.entity.Payment;
import com.crm.entity.User;
import com.crm.repository.EnrollmentRepository;
import com.crm.repository.PaymentRepository;
import com.crm.repository.UserRepository;
import com.crm.security.CurrentUserContext;
import com.crm.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository,
                               EnrollmentRepository enrollmentRepository,
                               UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public PaymentResponseDTO addPayment(PaymentRequestDTO dto) {
        Enrollment enrollment = enrollmentRepository.findById(dto.getEnrollmentId())
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + dto.getEnrollmentId()));

        Integer loggedInUserId = CurrentUserContext.get().getUserId();
        User createdBy = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Payment payment = Payment.builder()
                .enrollment(enrollment)
                .amount(dto.getAmount())
                .paymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : Payment.PaymentMethod.Cash)
                .transactionReference(dto.getTransactionReference())
                .remarks(dto.getRemarks())
                .createdBy(createdBy)
                .build();

        Payment saved = paymentRepository.save(payment);
        return PaymentResponseDTO.fromEntity(saved);
    }

    @Override
    public List<PaymentResponseDTO> getPaymentsByEnrollment(Integer enrollmentId) {
        return paymentRepository.findByEnrollment_EnrollmentId(enrollmentId)
                .stream()
                .map(PaymentResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public BigDecimal getPaidAmount(Integer enrollmentId) {
        return paymentRepository.sumByEnrollmentId(enrollmentId);
    }

    @Override
    public BigDecimal getPendingAmount(Integer enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        BigDecimal paid = getPaidAmount(enrollmentId);
        return enrollment.getTotalFees().subtract(paid);
    }

    @Override
    public BigDecimal getTotalRevenue() {
        return paymentRepository.getTotalRevenue();
    }
}