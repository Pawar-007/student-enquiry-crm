package com.crm.service;

import com.crm.dto.request.ModuleTeacherMappingRequestDTO;
import com.crm.dto.response.ModuleTeacherMappingResponseDTO;
import java.util.List;

public interface ModuleTeacherMappingService {
    ModuleTeacherMappingResponseDTO assignTeacherToModule(ModuleTeacherMappingRequestDTO dto);
    
    void removeMapping(Integer mappingId);
    
    List<ModuleTeacherMappingResponseDTO> getTeachersByModule(Integer moduleId);
    
    List<ModuleTeacherMappingResponseDTO> getModulesByTeacher(Integer teacherId);
}