package com.crm.dto.response;

import com.crm.entity.Course;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponseDTO {

    private Integer courseId;
    private String courseName;
    private String description;
    private String duration;
    private BigDecimal fees;
    private String brochurePdf;
    private UserSummaryDTO createdBy;   // pura User nahi, sirf summary
    private LocalDateTime createdAt;

    public static CourseResponseDTO fromEntity(Course course) {
        return CourseResponseDTO.builder()
                .courseId(course.getCourseId())
                .courseName(course.getCourseName())
                .description(course.getDescription())
                .duration(course.getDuration())
                .fees(course.getFees())
                .brochurePdf(course.getBrochurePdf())
                .createdBy(UserSummaryDTO.fromEntity(course.getCreatedBy()))
                .createdAt(course.getCreatedAt())
                .build();
        // NOTE: 'modules' aur 'batches' list yahan JAAN-BUJHKAR nahi daali —
        // warna Course -> Modules -> Course circular ho jayega.
        // Agar modules chahiye ho toh alag endpoint banao: GET /courses/{id}/modules
    }
}