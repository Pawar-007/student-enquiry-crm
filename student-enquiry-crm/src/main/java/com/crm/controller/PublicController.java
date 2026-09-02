package com.crm.controller;

import com.crm.dto.request.PublicEnquiryRequestDTO;
import com.crm.dto.response.CourseResponseDTO;
import com.crm.dto.response.EnquiryResponseDTO;
import com.crm.service.CourseService;
import com.crm.service.EnquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Ye saare endpoints BINA login ke accessible hain — students/visitors ke liye
@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final CourseService courseService;
    private final EnquiryService enquiryService;

    @Autowired
    public PublicController(CourseService courseService, EnquiryService enquiryService) {
        this.courseService = courseService;
        this.enquiryService = enquiryService;
    }

    // Website pe courses browse karne ke liye
    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponseDTO>> getCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<CourseResponseDTO> getCourseById(@PathVariable Integer id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    // Student ka enquiry form submit yahan aayega
    @PostMapping("/enquiries")
    public ResponseEntity<EnquiryResponseDTO> submitEnquiry(@RequestBody PublicEnquiryRequestDTO dto) {
        return ResponseEntity.status(201).body(enquiryService.createPublicEnquiry(dto));
    }
}