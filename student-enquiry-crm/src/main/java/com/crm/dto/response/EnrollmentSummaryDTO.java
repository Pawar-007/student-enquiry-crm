package com.crm.dto.response;

import com.crm.entity.Enrollment;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentSummaryDTO {

    private Integer enrollmentId;
    private String studentName;
    private String courseName;

    public static EnrollmentSummaryDTO fromEntity(Enrollment enrollment) {
        if (enrollment == null) return null;
        return EnrollmentSummaryDTO.builder()
                .enrollmentId(enrollment.getEnrollmentId())
                .studentName(enrollment.getStudent() != null ? enrollment.getStudent().getFullName() : null)
                .courseName(enrollment.getCourse() != null ? enrollment.getCourse().getCourseName() : null)
                .build();
    }
}