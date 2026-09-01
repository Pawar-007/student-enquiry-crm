package com.crm.service;

import com.crm.dto.response.EnrollmentResponseDTO;
import com.crm.dto.request.EnrollmentRequestDTO;
import com.crm.entity.Enrollment;
import java.util.List;

public interface EnrollmentService {

    // Poora conversion flow ek transaction mein: Student find/create + Enrollment banega + Enquiry status update hoga
    EnrollmentResponseDTO confirmAdmission(EnrollmentRequestDTO dto);

    EnrollmentResponseDTO updateEnrollmentStatus(Integer enrollmentId, Enrollment.EnrollmentStatus status);

    List<EnrollmentResponseDTO> getEnrollmentsByStudent(Integer studentId);

    EnrollmentResponseDTO getEnrollmentById(Integer enrollmentId);
}