package com.crm.controller;

import com.crm.dto.request.ModuleTeacherMappingRequestDTO;
import com.crm.dto.response.ModuleTeacherMappingResponseDTO;
import com.crm.security.RequireRole;
import com.crm.service.ModuleTeacherMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/module-teacher-mapping")
public class ModuleTeacherMappingController {

    private final ModuleTeacherMappingService mappingService;

    @Autowired
    public ModuleTeacherMappingController(ModuleTeacherMappingService mappingService) {
        this.mappingService = mappingService;
    }

    @PostMapping
    @RequireRole("Admin")
    public ResponseEntity<ModuleTeacherMappingResponseDTO> assign(@RequestBody ModuleTeacherMappingRequestDTO dto) {
        return ResponseEntity.status(201).body(mappingService.assignTeacherToModule(dto));
    }

    @DeleteMapping("/{id}")
    @RequireRole("Admin")
    public ResponseEntity<Void> remove(@PathVariable Integer id) {
        mappingService.removeMapping(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<ModuleTeacherMappingResponseDTO>> getByModule(@PathVariable Integer moduleId) {
        return ResponseEntity.ok(mappingService.getTeachersByModule(moduleId));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<ModuleTeacherMappingResponseDTO>> getByTeacher(@PathVariable Integer teacherId) {
        return ResponseEntity.ok(mappingService.getModulesByTeacher(teacherId));
    }
}