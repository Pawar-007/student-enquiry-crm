package com.crm.dto.request;

import com.crm.entity.Payment;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequestDTO {

    private Integer enrollmentId;
    private BigDecimal amount;
    private Payment.PaymentMethod paymentMethod;
    private String transactionReference;
    private String remarks;
}