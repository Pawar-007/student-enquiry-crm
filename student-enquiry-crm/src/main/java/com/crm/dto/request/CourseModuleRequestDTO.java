package com.crm.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseModuleRequestDTO {
    private Integer courseId;
    private String moduleName;
    private Integer moduleOrder;
    private String duration;
}