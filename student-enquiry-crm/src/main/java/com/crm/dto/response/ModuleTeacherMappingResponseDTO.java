package com.crm.dto.response;

import com.crm.entity.ModuleTeacherMapping;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModuleTeacherMappingResponseDTO {

    private Integer mappingId;
    private String moduleName;
    private TeacherResponseDTO teacher;
    private LocalDate assignedDate;

    public static ModuleTeacherMappingResponseDTO fromEntity(ModuleTeacherMapping mapping) {
        return ModuleTeacherMappingResponseDTO.builder()
                .mappingId(mapping.getMappingId())
                .moduleName(mapping.getModule() != null ? mapping.getModule().getModuleName() : null)
                .teacher(TeacherResponseDTO.fromEntity(mapping.getTeacher()))
                .assignedDate(mapping.getAssignedDate())
                .build();
    }
}