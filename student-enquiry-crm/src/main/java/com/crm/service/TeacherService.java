package com.crm.service;

import com.crm.dto.response.TeacherResponseDTO;
import com.crm.entity.Teacher;
import java.util.List;

public interface TeacherService {

    Teacher createTeacher(Teacher teacher, Integer adminUserId);

    Teacher updateTeacher(Integer teacherId, Teacher teacher);

    void deleteTeacher(Integer teacherId);

    Teacher getTeacherById(Integer teacherId);

    List<TeacherResponseDTO> getAllTeachers();
}