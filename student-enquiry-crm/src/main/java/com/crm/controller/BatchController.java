package com.crm.controller;

import com.crm.dto.request.BatchRequestDTO;
import com.crm.dto.response.BatchResponseDTO;
import com.crm.security.RequireRole;
import com.crm.service.BatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
public class BatchController {

    private final BatchService batchService;

    @Autowired
    public BatchController(BatchService batchService) {
        this.batchService = batchService;
    }

    @PostMapping
    @RequireRole("Admin")
    public ResponseEntity<BatchResponseDTO> createBatch(@RequestBody BatchRequestDTO dto) {
        return ResponseEntity.status(201).body(batchService.createBatch(dto));
    }

    @PatchMapping("/{id}")
    @RequireRole("Admin")
    public ResponseEntity<BatchResponseDTO> updateBatch(@PathVariable Integer id, @RequestBody BatchRequestDTO dto) {
        return ResponseEntity.ok(batchService.updateBatch(id, dto));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<BatchResponseDTO>> getByCourse(@PathVariable Integer courseId) {
        return ResponseEntity.ok(batchService.getBatchesByCourse(courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BatchResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(batchService.getBatchById(id));
    }
}