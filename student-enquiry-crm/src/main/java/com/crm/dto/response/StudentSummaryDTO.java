package com.crm.dto.response;

import com.crm.entity.Student;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentSummaryDTO {

    private Integer studentId;
    private String fullName;
    private String mobileNumber;

    public static StudentSummaryDTO fromEntity(Student student) {
        if (student == null) return null;
        return StudentSummaryDTO.builder()
                .studentId(student.getStudentId())
                .fullName(student.getFullName())
                .mobileNumber(student.getMobileNumber())
                .build();
    }
}	