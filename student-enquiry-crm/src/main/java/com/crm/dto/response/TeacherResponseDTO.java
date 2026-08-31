package com.crm.dto.response;

import com.crm.entity.Teacher;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherResponseDTO {

    private Integer teacherId;
    private String name;
    private String email;
    private String mobile;
    private String expertise;

    public static TeacherResponseDTO fromEntity(Teacher teacher) {
        return TeacherResponseDTO.builder()
                .teacherId(teacher.getTeacherId())
                .name(teacher.getName())
                .email(teacher.getEmail())
                .mobile(teacher.getMobile())
                .expertise(teacher.getExpertise())
                .build();
    }
}