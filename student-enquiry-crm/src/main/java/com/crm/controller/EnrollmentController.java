package com.crm.controller;

import com.crm.dto.request.EnrollmentRequestDTO;
import com.crm.dto.response.EnrollmentResponseDTO;
import com.crm.entity.Enrollment;
import com.crm.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @Autowired
    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/confirm-admission")
    public ResponseEntity<EnrollmentResponseDTO> confirmAdmission(@RequestBody EnrollmentRequestDTO dto) {
        return ResponseEntity.status(201).body(enrollmentService.confirmAdmission(dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EnrollmentResponseDTO> updateStatus(
            @PathVariable Integer id,
            @RequestParam Enrollment.EnrollmentStatus status) {
        return ResponseEntity.ok(enrollmentService.updateEnrollmentStatus(id, status));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EnrollmentResponseDTO>> getByStudent(@PathVariable Integer studentId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByStudent(studentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentById(id));
    }
}