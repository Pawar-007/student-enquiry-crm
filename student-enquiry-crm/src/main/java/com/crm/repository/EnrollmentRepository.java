package com.crm.repository;

import com.crm.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {

    List<Enrollment> findByStudent_StudentId(Integer studentId);

    List<Enrollment> findByCourse_CourseId(Integer courseId);
}