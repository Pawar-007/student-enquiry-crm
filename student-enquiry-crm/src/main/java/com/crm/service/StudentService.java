package com.crm.service;

import com.crm.dto.response.StudentResponseDTO;
import com.crm.dto.response.StudentSummaryDTO;
import com.crm.entity.Student;
import java.util.Optional;

public interface StudentService {

    // mobile number check karega - agar student already exist karta hai to reuse karega
	Student findOrCreateStudent(String fullName, String mobileNumber, String email, Integer enquiryId);
	
    Optional<Student> findByMobileNumber(String mobileNumber);

    Student getStudentEntityById(Integer studentId);
}