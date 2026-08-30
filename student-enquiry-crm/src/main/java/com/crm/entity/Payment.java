package com.crm.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_date")
    @Builder.Default
    private LocalDateTime paymentDate = LocalDateTime.now();

    @Convert(converter = PaymentMethodConverter.class)
    @Builder.Default
    @Column(name = "payment_method", length = 20)
    private PaymentMethod paymentMethod = PaymentMethod.Cash;

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @Column(length = 255)
    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    public enum PaymentMethod {
        Cash("Cash"), UPI("UPI"), Card("Card"), Bank_Transfer("Bank Transfer"), Other("Other");
        private final String dbValue;
        PaymentMethod(String dbValue) { this.dbValue = dbValue; }
        public String getDbValue() { return dbValue; }
        public static PaymentMethod fromDbValue(String value) {
            for (PaymentMethod m : values()) if (m.dbValue.equals(value)) return m;
            throw new IllegalArgumentException("Unknown payment_method: " + value);
        }
    }

    @Converter
    public static class PaymentMethodConverter implements AttributeConverter<PaymentMethod, String> {
        public String convertToDatabaseColumn(PaymentMethod attribute) {
            return attribute == null ? null : attribute.getDbValue();
        }
        public PaymentMethod convertToEntityAttribute(String dbData) {
            return dbData == null ? null : PaymentMethod.fromDbValue(dbData);
        }
    }
}