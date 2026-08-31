package com.crm.service;

import com.crm.dto.response.ModuleTeacherMappingResponseDTO;
import com.crm.entity.ModuleTeacherMapping;
import java.util.List;

public interface ModuleTeacherMappingService {

    ModuleTeacherMapping assignTeacherToModule(Integer moduleId, Integer teacherId);

    void removeMapping(Integer mappingId);

    List<ModuleTeacherMappingResponseDTO> getTeachersByModule(Integer moduleId);

    List<ModuleTeacherMappingResponseDTO> getModulesByTeacher(Integer teacherId);
}