package com.crm.controller;

import com.crm.dto.request.CourseModuleRequestDTO;
import com.crm.dto.response.CourseModuleResponseDTO;
import com.crm.security.RequireRole;
import com.crm.service.CourseModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
public class CourseModuleController {

    private final CourseModuleService courseModuleService;

    @Autowired
    public CourseModuleController(CourseModuleService courseModuleService) {
        this.courseModuleService = courseModuleService;
    }

    @PostMapping
    @RequireRole("Admin")
    public ResponseEntity<CourseModuleResponseDTO> addModule(@RequestBody CourseModuleRequestDTO dto) {
        return ResponseEntity.status(201).body(courseModuleService.addModule(dto));
    }

    @PatchMapping("/{id}")
    @RequireRole("Admin")
    public ResponseEntity<CourseModuleResponseDTO> updateModule(@PathVariable Integer id, @RequestBody CourseModuleRequestDTO dto) {
        return ResponseEntity.ok(courseModuleService.updateModule(id, dto));
    }

    @DeleteMapping("/{id}")
    @RequireRole("Admin")
    public ResponseEntity<Void> deleteModule(@PathVariable Integer id) {
        courseModuleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseModuleResponseDTO>> getByCourse(@PathVariable Integer courseId) {
        return ResponseEntity.ok(courseModuleService.getModulesByCourse(courseId));
    }
}