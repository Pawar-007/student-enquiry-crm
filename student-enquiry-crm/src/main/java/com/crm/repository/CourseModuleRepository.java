package com.crm.repository;

import com.crm.entity.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseModuleRepository extends JpaRepository<CourseModule, Integer> {

    List<CourseModule> findByCourse_CourseIdOrderByModuleOrderAsc(Integer courseId);
}