package com.crm.service;

import com.crm.dto.request.TeacherRequestDTO;
import com.crm.dto.response.TeacherResponseDTO;
import java.util.List;

public interface TeacherService {
    TeacherResponseDTO createTeacher(TeacherRequestDTO dto, Integer adminUserId);
    TeacherResponseDTO updateTeacher(Integer teacherId, TeacherRequestDTO dto);
    void deleteTeacher(Integer teacherId);
    TeacherResponseDTO getTeacherById(Integer teacherId);
    List<TeacherResponseDTO> getAllTeachers();
}