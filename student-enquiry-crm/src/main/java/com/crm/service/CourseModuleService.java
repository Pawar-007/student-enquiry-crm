package com.crm.service;

import com.crm.dto.request.CourseModuleRequestDTO;
import com.crm.dto.response.CourseModuleResponseDTO;
import java.util.List;

public interface CourseModuleService {
    CourseModuleResponseDTO addModule(CourseModuleRequestDTO dto);
    CourseModuleResponseDTO updateModule(Integer moduleId, CourseModuleRequestDTO dto);
    void deleteModule(Integer moduleId);
    List<CourseModuleResponseDTO> getModulesByCourse(Integer courseId);
}