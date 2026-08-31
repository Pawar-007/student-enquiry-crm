package com.crm.dto.response;

import com.crm.entity.Payment;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDTO {

    private Integer paymentId;
    private EnrollmentSummaryDTO enrollment;   // pura Enrollment nahi
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private Payment.PaymentMethod paymentMethod;
    private String transactionReference;
    private String remarks;

    public static PaymentResponseDTO fromEntity(Payment payment) {
        return PaymentResponseDTO.builder()
                .paymentId(payment.getPaymentId())
                .enrollment(EnrollmentSummaryDTO.fromEntity(payment.getEnrollment()))
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .transactionReference(payment.getTransactionReference())
                .remarks(payment.getRemarks())
                .build();
    }
}