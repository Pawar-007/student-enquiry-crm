package com.crm.service.impl;

import com.crm.dto.request.TeacherRequestDTO;
import com.crm.dto.response.TeacherResponseDTO;
import com.crm.entity.Teacher;
import com.crm.entity.User;
import com.crm.repository.TeacherRepository;
import com.crm.repository.UserRepository;
import com.crm.service.TeacherService;
import com.crm.util.CommonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    @Autowired
    public TeacherServiceImpl(TeacherRepository teacherRepository, UserRepository userRepository) {
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
    }

    @Override
    public TeacherResponseDTO createTeacher(TeacherRequestDTO dto, Integer adminUserId) {
        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new IllegalArgumentException("Teacher name is required");
        }

        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        Teacher teacher = Teacher.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .mobile(dto.getMobile())
                .expertise(dto.getExpertise())
                .createdBy(admin)
                .build();

        return TeacherResponseDTO.fromEntity(teacherRepository.save(teacher));
    }

    @Override
    public TeacherResponseDTO updateTeacher(Integer teacherId, TeacherRequestDTO dto) {
        Teacher existing = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));
        CommonUtils.copyNonNullProperties(dto, existing);
        return TeacherResponseDTO.fromEntity(teacherRepository.save(existing));
    }

    @Override
    public void deleteTeacher(Integer teacherId) {
        if (!teacherRepository.existsById(teacherId)) {
            throw new RuntimeException("Teacher not found with id: " + teacherId);
        }
        teacherRepository.deleteById(teacherId);
    }

    @Override
    public TeacherResponseDTO getTeacherById(Integer teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));
        return TeacherResponseDTO.fromEntity(teacher);
    }

    @Override
    public List<TeacherResponseDTO> getAllTeachers() {
        return teacherRepository.findAll()
                .stream()
                .map(TeacherResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}