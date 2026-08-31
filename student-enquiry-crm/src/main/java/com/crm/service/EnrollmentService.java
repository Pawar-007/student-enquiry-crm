package com.crm.service;

import com.crm.dto.response.EnrollmentResponseDTO;
import com.crm.entity.Enrollment;
import java.util.List;

public interface EnrollmentService {

    // admission confirm hone par: Student find/create + naya Enrollment banega + Enquiry status update hoga
    Enrollment confirmAdmission(Integer enquiryId, Integer courseId, Integer counsellorId,
                                 java.math.BigDecimal totalFees, Integer batchId);

    Enrollment updateEnrollmentStatus(Integer enrollmentId, Enrollment.EnrollmentStatus status);

    List<EnrollmentResponseDTO> getEnrollmentsByStudent(Integer studentId);

    Enrollment getEnrollmentById(Integer enrollmentId);
}