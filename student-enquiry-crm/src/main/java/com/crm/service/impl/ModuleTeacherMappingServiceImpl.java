package com.crm.service.impl;

import com.crm.dto.request.ModuleTeacherMappingRequestDTO;
import com.crm.dto.response.ModuleTeacherMappingResponseDTO;
import com.crm.entity.CourseModule;
import com.crm.entity.ModuleTeacherMapping;
import com.crm.entity.Teacher;
import com.crm.repository.CourseModuleRepository;
import com.crm.repository.ModuleTeacherMappingRepository;
import com.crm.repository.TeacherRepository;
import com.crm.service.ModuleTeacherMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ModuleTeacherMappingServiceImpl implements ModuleTeacherMappingService {

    private final ModuleTeacherMappingRepository mappingRepository;
    private final CourseModuleRepository courseModuleRepository;
    private final TeacherRepository teacherRepository;

    @Autowired
    public ModuleTeacherMappingServiceImpl(ModuleTeacherMappingRepository mappingRepository,
                                            CourseModuleRepository courseModuleRepository,
                                            TeacherRepository teacherRepository) {
        this.mappingRepository = mappingRepository;
        this.courseModuleRepository = courseModuleRepository;
        this.teacherRepository = teacherRepository;
    }

    @Override
    public ModuleTeacherMappingResponseDTO assignTeacherToModule(ModuleTeacherMappingRequestDTO dto) {
        CourseModule module = courseModuleRepository.findById(dto.getModuleId())
                .orElseThrow(() -> new RuntimeException("Module not found with id: " + dto.getModuleId()));

        Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + dto.getTeacherId()));

        ModuleTeacherMapping mapping = ModuleTeacherMapping.builder()
                .module(module)
                .teacher(teacher)
                .build();

        return ModuleTeacherMappingResponseDTO.fromEntity(mappingRepository.save(mapping));
    }

    @Override
    public void removeMapping(Integer mappingId) {
        if (!mappingRepository.existsById(mappingId)) {
            throw new RuntimeException("Mapping not found with id: " + mappingId);
        }
        mappingRepository.deleteById(mappingId);
    }

    @Override
    public List<ModuleTeacherMappingResponseDTO> getTeachersByModule(Integer moduleId) {
        return mappingRepository.findByModule_ModuleId(moduleId)
                .stream()
                .map(ModuleTeacherMappingResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ModuleTeacherMappingResponseDTO> getModulesByTeacher(Integer teacherId) {
        return mappingRepository.findByTeacher_TeacherId(teacherId)
                .stream()
                .map(ModuleTeacherMappingResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}