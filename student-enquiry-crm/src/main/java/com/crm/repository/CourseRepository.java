package com.crm.repository;

import com.crm.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    java.util.List<Course> findByCourseNameContainingIgnoreCase(String name);
}