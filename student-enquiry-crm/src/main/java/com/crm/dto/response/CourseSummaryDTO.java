package com.crm.dto.response;

import com.crm.entity.Course;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseSummaryDTO {

    private Integer courseId;
    private String courseName;

    public static CourseSummaryDTO fromEntity(Course course) {
        if (course == null) return null;
        return CourseSummaryDTO.builder()
                .courseId(course.getCourseId())
                .courseName(course.getCourseName())
                .build();
    }
}