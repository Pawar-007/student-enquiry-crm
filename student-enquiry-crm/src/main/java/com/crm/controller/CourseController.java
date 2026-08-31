package com.crm.controller;

import com.crm.dto.request.CourseRequestDTO;
import com.crm.dto.response.CourseResponseDTO;
import com.crm.security.CurrentUserContext;
import com.crm.security.RequireRole;
import com.crm.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

	@Autowired
    private CourseService courseService;

    // Sirf Admin course bana sakta hai
    @PostMapping
    @RequireRole("Admin")
    public ResponseEntity<CourseResponseDTO> createCourse(@Valid @RequestBody CourseRequestDTO dto) {
        Integer adminUserId = CurrentUserContext.get().getUserId();
        CourseResponseDTO response = courseService.createCourse(dto, adminUserId);
        return ResponseEntity.status(201).body(response);
    }

    // Sirf Admin update kar sakta hai (partial update - PATCH)
    @PatchMapping("/{id}")
    @RequireRole("Admin")
    public ResponseEntity<CourseResponseDTO> updateCourse(
            @PathVariable Integer id,
            @RequestBody CourseRequestDTO dto) {
        return ResponseEntity.ok(courseService.updateCourse(id, dto));
    }

    // Sirf Admin delete kar sakta hai
    @DeleteMapping("/{id}")
    @RequireRole("Admin")
    public ResponseEntity<Void> deleteCourse(@PathVariable Integer id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    // Admin + Counsellor dono dekh sakte hain (Counsellor ko enquiry banate waqt course select karna hota hai)
    @GetMapping("/{id}")
    public ResponseEntity<CourseResponseDTO> getCourseById(@PathVariable Integer id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    // Admin + Counsellor dono dekh sakte hain
    @GetMapping
    public ResponseEntity<List<CourseResponseDTO>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    // Admin + Counsellor dono search kar sakte hain
    @GetMapping("/search")
    public ResponseEntity<List<CourseResponseDTO>> searchCourses(@RequestParam String name) {
        return ResponseEntity.ok(courseService.searchCoursesByName(name));
    }
}