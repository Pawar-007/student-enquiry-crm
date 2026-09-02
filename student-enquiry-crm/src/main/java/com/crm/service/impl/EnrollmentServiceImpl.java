package com.crm.service.impl;

import com.crm.dto.request.EnrollmentRequestDTO;
import com.crm.dto.response.EnrollmentResponseDTO;
import com.crm.entity.*;
import com.crm.repository.*;
import com.crm.security.CurrentUserContext;
import com.crm.service.EnrollmentService;
import com.crm.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final EnquiryRepository enquiryRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final BatchRepository batchRepository;
    private final StudentService studentService;

    @Autowired
    public EnrollmentServiceImpl(EnrollmentRepository enrollmentRepository,
                                  EnquiryRepository enquiryRepository,
                                  CourseRepository courseRepository,
                                  UserRepository userRepository,
                                  BatchRepository batchRepository,
                                  StudentService studentService) {
        this.enrollmentRepository = enrollmentRepository;
        this.enquiryRepository = enquiryRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.batchRepository = batchRepository;
        this.studentService = studentService;
    }

    @Override
    @Transactional
    public EnrollmentResponseDTO confirmAdmission(EnrollmentRequestDTO dto) {

        Enquiry enquiry = enquiryRepository.findById(dto.getEnquiryId())
                .orElseThrow(() -> new RuntimeException("Enquiry not found with id: " + dto.getEnquiryId()));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + dto.getCourseId()));

        Integer loggedInUserId = CurrentUserContext.get().getUserId();
        User counsellor = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Batch batch = null;
        if (dto.getBatchId() != null) {
            batch = batchRepository.findById(dto.getBatchId())
                    .orElseThrow(() -> new RuntimeException("Batch not found with id: " + dto.getBatchId()));
        }

        Student student = studentService.findOrCreateStudent(
                enquiry.getFullName(), enquiry.getMobileNumber(), enquiry.getEmail(), enquiry.getEnquiryId());

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .enquiry(enquiry)
                .counsellor(counsellor)
                .batch(batch)
                .totalFees(dto.getTotalFees())
                .status(Enrollment.EnrollmentStatus.Active)
                .build();

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        enquiry.setStatus(Enquiry.Status.Admission_Done);
        enquiryRepository.save(enquiry);

        return EnrollmentResponseDTO.fromEntity(savedEnrollment);
    }

    @Override
    public EnrollmentResponseDTO updateEnrollmentStatus(Integer enrollmentId, Enrollment.EnrollmentStatus status) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));
        enrollment.setStatus(status);
        return EnrollmentResponseDTO.fromEntity(enrollmentRepository.save(enrollment));
    }

    @Override
    public List<EnrollmentResponseDTO> getEnrollmentsByStudent(Integer studentId) {
        return enrollmentRepository.findByStudent_StudentId(studentId)
                .stream()
                .map(EnrollmentResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public EnrollmentResponseDTO getEnrollmentById(Integer enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));
        return EnrollmentResponseDTO.fromEntity(enrollment);
    }
}