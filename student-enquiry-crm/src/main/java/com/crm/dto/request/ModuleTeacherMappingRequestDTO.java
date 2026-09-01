package com.crm.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModuleTeacherMappingRequestDTO {
    private Integer moduleId;
    private Integer teacherId;
}