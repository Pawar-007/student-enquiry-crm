package com.crm.service.impl;

import com.crm.dto.request.CourseRequestDTO;
import com.crm.dto.response.CourseResponseDTO;
import com.crm.entity.Course;
import com.crm.entity.User;
import com.crm.repository.CourseRepository;
import com.crm.repository.UserRepository;
import com.crm.service.CourseService;
import com.crm.util.CommonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Autowired
    public CourseServiceImpl(CourseRepository courseRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CourseResponseDTO createCourse(CourseRequestDTO dto, Integer adminUserId) {
        if (dto.getCourseName() == null || dto.getCourseName().isBlank()) {
            throw new IllegalArgumentException("Course name is required");
        }

        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        Course course = Course.builder()
                .courseName(dto.getCourseName())
                .description(dto.getDescription())
                .duration(dto.getDuration())
                .fees(dto.getFees())
                .brochurePdf(dto.getBrochurePdf())
                .createdBy(admin)
                .build();

        Course savedCourse = courseRepository.save(course);
        return CourseResponseDTO.fromEntity(savedCourse);
    }

    @Override
    public CourseResponseDTO updateCourse(Integer courseId, CourseRequestDTO dto) {
        Course existingCourse = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        // Sirf non-null fields update honge (partial update)
        CommonUtils.copyNonNullProperties(dto, existingCourse);

        Course updatedCourse = courseRepository.save(existingCourse);
        return CourseResponseDTO.fromEntity(updatedCourse);
    }

    @Override
    public void deleteCourse(Integer courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException("Course not found with id: " + courseId);
        }
        courseRepository.deleteById(courseId);
    }

    @Override
    public CourseResponseDTO getCourseById(Integer courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        return CourseResponseDTO.fromEntity(course);
    }

    @Override
    public List<CourseResponseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(CourseResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponseDTO> searchCoursesByName(String name) {
        return courseRepository.findByCourseNameContainingIgnoreCase(name)
                .stream()
                .map(CourseResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}