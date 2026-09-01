package com.crm.service.impl;

import com.crm.dto.request.CourseModuleRequestDTO;
import com.crm.dto.response.CourseModuleResponseDTO;
import com.crm.entity.Course;
import com.crm.entity.CourseModule;
import com.crm.repository.CourseModuleRepository;
import com.crm.repository.CourseRepository;
import com.crm.service.CourseModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseModuleServiceImpl implements CourseModuleService {

    private final CourseModuleRepository courseModuleRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public CourseModuleServiceImpl(CourseModuleRepository courseModuleRepository, CourseRepository courseRepository) {
        this.courseModuleRepository = courseModuleRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public CourseModuleResponseDTO addModule(CourseModuleRequestDTO dto) {
        if (dto.getCourseId() == null) {
            throw new IllegalArgumentException("Course ID is required");
        }
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + dto.getCourseId()));

        CourseModule module = CourseModule.builder()
                .course(course)
                .moduleName(dto.getModuleName())
                .moduleOrder(dto.getModuleOrder())
                .duration(dto.getDuration())
                .build();

        return CourseModuleResponseDTO.fromEntity(courseModuleRepository.save(module));
    }

    @Override
    public CourseModuleResponseDTO updateModule(Integer moduleId, CourseModuleRequestDTO dto) {
        CourseModule existing = courseModuleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found with id: " + moduleId));

        if (dto.getModuleName() != null) existing.setModuleName(dto.getModuleName());
        if (dto.getModuleOrder() != null) existing.setModuleOrder(dto.getModuleOrder());
        if (dto.getDuration() != null) existing.setDuration(dto.getDuration());

        return CourseModuleResponseDTO.fromEntity(courseModuleRepository.save(existing));
    }

    @Override
    public void deleteModule(Integer moduleId) {
        if (!courseModuleRepository.existsById(moduleId)) {
            throw new RuntimeException("Module not found with id: " + moduleId);
        }
        courseModuleRepository.deleteById(moduleId);
    }

    @Override
    public List<CourseModuleResponseDTO> getModulesByCourse(Integer courseId) {
        return courseModuleRepository.findByCourse_CourseIdOrderByModuleOrderAsc(courseId)
                .stream()
                .map(CourseModuleResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}