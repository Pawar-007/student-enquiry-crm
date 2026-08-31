package com.crm.service;

import com.crm.dto.response.CourseModuleResponseDTO;
import com.crm.entity.CourseModule;
import java.util.List;

public interface CourseModuleService {

    CourseModule addModule(CourseModule module);

    CourseModule updateModule(Integer moduleId, CourseModule module);

    void deleteModule(Integer moduleId);

    List<CourseModuleResponseDTO> getModulesByCourse(Integer courseId);
}