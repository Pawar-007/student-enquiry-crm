package com.crm.dto.response;

import com.crm.entity.CourseModule;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseModuleResponseDTO {

    private Integer moduleId;
    private CourseSummaryDTO course;
    private String moduleName;
    private Integer moduleOrder;
    private String duration;

    public static CourseModuleResponseDTO fromEntity(CourseModule module) {
        return CourseModuleResponseDTO.builder()
                .moduleId(module.getModuleId())
                .course(CourseSummaryDTO.fromEntity(module.getCourse()))
                .moduleName(module.getModuleName())
                .moduleOrder(module.getModuleOrder())
                .duration(module.getDuration())
                .build();
    }
}