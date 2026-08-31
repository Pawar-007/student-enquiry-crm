package com.crm.dto.response;

import com.crm.entity.Enrollment;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentResponseDTO {

    private Integer enrollmentId;
    private StudentSummaryDTO student;
    private CourseSummaryDTO course;
    private UserSummaryDTO counsellor;
    private BatchSummaryDTO batch;
    private LocalDate admissionDate;
    private BigDecimal totalFees;
    private BigDecimal paidAmount;      // Entity ke @Transient getter se
    private BigDecimal pendingAmount;   // Entity ke @Transient getter se
    private Enrollment.EnrollmentStatus status;

    public static EnrollmentResponseDTO fromEntity(Enrollment enrollment) {
        return EnrollmentResponseDTO.builder()
                .enrollmentId(enrollment.getEnrollmentId())
                .student(StudentSummaryDTO.fromEntity(enrollment.getStudent()))
                .course(CourseSummaryDTO.fromEntity(enrollment.getCourse()))
                .counsellor(UserSummaryDTO.fromEntity(enrollment.getCounsellor()))
                .batch(BatchSummaryDTO.fromEntity(enrollment.getBatch()))
                .admissionDate(enrollment.getAdmissionDate())
                .totalFees(enrollment.getTotalFees())
                .paidAmount(enrollment.getPaidAmount())         // calculated
                .pendingAmount(enrollment.getPendingAmount())   // calculated
                .status(enrollment.getStatus())
                .build();
        // NOTE: 'payments' list yahan jaan-bujhkar nahi daali —
        // agar poori payment history chahiye ho, alag endpoint:
        // GET /enrollments/{id}/payments
    }
}