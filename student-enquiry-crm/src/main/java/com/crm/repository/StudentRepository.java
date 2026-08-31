package com.crm.repository;

import com.crm.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {

    Optional<Student> findByMobileNumber(String mobileNumber);

    boolean existsByMobileNumber(String mobileNumber);
}