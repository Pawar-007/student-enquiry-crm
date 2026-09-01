package com.crm.service.impl;

import com.crm.entity.Enquiry;
import com.crm.entity.Student;
import com.crm.repository.EnquiryRepository;
import com.crm.repository.StudentRepository;
import com.crm.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final EnquiryRepository enquiryRepository;

    @Autowired
    public StudentServiceImpl(StudentRepository studentRepository, EnquiryRepository enquiryRepository) {
        this.studentRepository = studentRepository;
        this.enquiryRepository = enquiryRepository;
    }

    @Override
    public Student findOrCreateStudent(String fullName, String mobileNumber, String email, Integer enquiryId) {
        Optional<Student> existing = studentRepository.findByMobileNumber(mobileNumber);
        if (existing.isPresent()) {
            return existing.get();   // dusra course join kar raha hai - purana student reuse
        }

        Enquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() -> new RuntimeException("Enquiry not found with id: " + enquiryId));

        Student student = Student.builder()
                .enquiry(enquiry)
                .fullName(fullName)
                .mobileNumber(mobileNumber)
                .email(email)
                .build();

        return studentRepository.save(student);
    }

    @Override
    public Optional<Student> findByMobileNumber(String mobileNumber) {
        return studentRepository.findByMobileNumber(mobileNumber);
    }

    @Override
    public Student getStudentEntityById(Integer studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
    }
}