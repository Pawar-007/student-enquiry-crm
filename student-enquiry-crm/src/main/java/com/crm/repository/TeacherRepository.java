package com.crm.repository;

import com.crm.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, Integer> {

    List<Teacher> findByNameContainingIgnoreCase(String name);
}