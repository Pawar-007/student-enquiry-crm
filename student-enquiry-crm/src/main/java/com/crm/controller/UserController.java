package com.crm.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.crm.dto.request.UserRequestDTO;
import com.crm.dto.response.UserResponseDTO;
import com.crm.security.RequireRole;
import com.crm.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {
	
	@Autowired
	UserService userService;

	@PostMapping
    @RequireRole("Admin")   // <-- apna version, @PreAuthorize jaisa hi kaam karega
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO dto) {
        return ResponseEntity.ok(userService.createUser(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Integer id, @RequestBody UserRequestDTO dto) {
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    @PatchMapping("/{id}/block")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<Void> blockUser(@PathVariable Integer id) {
        userService.blockUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/unblock")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<Void> unblockUser(@PathVariable Integer id) {
        userService.unblockUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/counsellors")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<List<UserResponseDTO>> getAllCounsellors() {
        return ResponseEntity.ok(userService.getAllCounsellors());
    }

    @GetMapping("/counsellors/active")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<List<UserResponseDTO>> getActiveCounsellors() {
        return ResponseEntity.ok(userService.getActiveCounsellors());
    }
}