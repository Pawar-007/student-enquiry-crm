package com.crm.service;

import com.crm.dto.request.CourseRequestDTO;
import com.crm.dto.response.CourseResponseDTO;
import java.util.List;

public interface CourseService {

    CourseResponseDTO createCourse(CourseRequestDTO dto, Integer adminUserId);

    CourseResponseDTO updateCourse(Integer courseId, CourseRequestDTO dto);

    void deleteCourse(Integer courseId);

    CourseResponseDTO getCourseById(Integer courseId);

    List<CourseResponseDTO> getAllCourses();

    List<CourseResponseDTO> searchCoursesByName(String name);
}