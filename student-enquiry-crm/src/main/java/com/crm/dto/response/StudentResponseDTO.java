package com.crm.dto.response;

import com.crm.entity.Student;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponseDTO {

    private Integer studentId;
    private String fullName;
    private String mobileNumber;
    private String email;
    private Student.Gender gender;
    private LocalDate dob;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String education;
    private LocalDateTime createdAt;

    public static StudentResponseDTO fromEntity(Student student) {
        return StudentResponseDTO.builder()
                .studentId(student.getStudentId())
                .fullName(student.getFullName())
                .mobileNumber(student.getMobileNumber())
                .email(student.getEmail())
                .gender(student.getGender())
                .dob(student.getDob())
                .address(student.getAddress())
                .city(student.getCity())
                .state(student.getState())
                .pincode(student.getPincode())
                .education(student.getEducation())
                .createdAt(student.getCreatedAt())
                .build();
        // NOTE: 'enrollments' list yahan nahi daali —
        // Student -> Enrollments -> Student circular hone se bachne ke liye.
        // Chahiye ho to alag endpoint: GET /students/{id}/enrollments
    }
}