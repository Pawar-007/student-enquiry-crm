package com.crm.repository;

import com.crm.entity.ModuleTeacherMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ModuleTeacherMappingRepository extends JpaRepository<ModuleTeacherMapping, Integer> {

    List<ModuleTeacherMapping> findByModule_ModuleId(Integer moduleId);

    List<ModuleTeacherMapping> findByTeacher_TeacherId(Integer teacherId);
}