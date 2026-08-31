package com.crm.service;

import com.crm.dto.response.CourseResponseDTO;
import com.crm.entity.Course;
import java.util.List;

public interface CourseService {

    Course createCourse(Course course, Integer adminUserId);

    Course updateCourse(Integer courseId, Course course);

    void deleteCourse(Integer courseId);

    Course getCourseById(Integer courseId);

    List<CourseResponseDTO> getAllCourses();

    List<CourseResponseDTO> searchCoursesByName(String name);
}