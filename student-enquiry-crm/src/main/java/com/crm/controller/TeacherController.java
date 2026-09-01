package com.crm.controller;

import com.crm.dto.request.TeacherRequestDTO;
import com.crm.dto.response.TeacherResponseDTO;
import com.crm.security.CurrentUserContext;
import com.crm.security.RequireRole;
import com.crm.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    @Autowired
    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @PostMapping
    @RequireRole("Admin")
    public ResponseEntity<TeacherResponseDTO> createTeacher(@RequestBody TeacherRequestDTO dto) {
        Integer adminUserId = CurrentUserContext.get().getUserId();
        return ResponseEntity.status(201).body(teacherService.createTeacher(dto, adminUserId));
    }

    @PatchMapping("/{id}")
    @RequireRole("Admin")
    public ResponseEntity<TeacherResponseDTO> updateTeacher(@PathVariable Integer id, @RequestBody TeacherRequestDTO dto) {
        return ResponseEntity.ok(teacherService.updateTeacher(id, dto));
    }

    @DeleteMapping("/{id}")
    @RequireRole("Admin")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Integer id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(teacherService.getTeacherById(id));
    }

    @GetMapping
    public ResponseEntity<List<TeacherResponseDTO>> getAll() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }
}