package com.crm.controller;

import com.crm.dto.request.EnquiryRequestDTO;
import com.crm.dto.response.EnquiryResponseDTO;
import com.crm.entity.Enquiry;
import com.crm.security.CurrentUserContext;
import com.crm.security.RequireRole;
import com.crm.service.EnquiryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    private final EnquiryService enquiryService;

    @Autowired
    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    // Admin (phone call) aur Counsellor (walk-in) dono create kar sakte hain
    @PostMapping
    public ResponseEntity<EnquiryResponseDTO> createEnquiry(@Valid @RequestBody EnquiryRequestDTO dto) {
        var currentUser = CurrentUserContext.get();
        EnquiryResponseDTO response = enquiryService.createEnquiry(
                dto, currentUser.getUserId(), currentUser.getRole());
        return ResponseEntity.status(201).body(response);
    }

    // Admin (kisi bhi enquiry ka) + Counsellor (sirf apni) - ownership check Service ke andar hai
    @PatchMapping("/{id}/status")
    public ResponseEntity<EnquiryResponseDTO> updateStatus(
            @PathVariable Integer id,
            @RequestParam Enquiry.Status status) {
        return ResponseEntity.ok(enquiryService.updateEnquiryStatus(id, status));
    }

    // Sirf Admin counsellor assign kar sakta hai (Phone/Website source ke liye)
    @PatchMapping("/{id}/assign")
    @RequireRole("Admin")
    public ResponseEntity<EnquiryResponseDTO> assignCounsellor(
            @PathVariable Integer id,
            @RequestParam Integer counsellorId) {
        return ResponseEntity.ok(enquiryService.assignCounsellor(id, counsellorId));
    }

    // Admin + Counsellor (apni) - ownership check Service ke andar
    @PatchMapping("/{id}/priority")
    public ResponseEntity<EnquiryResponseDTO> updatePriority(
            @PathVariable Integer id,
            @RequestParam Enquiry.Priority priority) {
        return ResponseEntity.ok(enquiryService.updatePriority(id, priority));
    }

    // Admin (kisi bhi) + Counsellor (sirf apni) - ownership check Service ke andar
    @GetMapping("/{id}")
    public ResponseEntity<EnquiryResponseDTO> getEnquiryById(@PathVariable Integer id) {
        return ResponseEntity.ok(enquiryService.getEnquiryById(id));
    }

    // Sirf Admin - kisi bhi counsellor ki enquiries dekh sakta hai
    @GetMapping("/counsellor/{counsellorId}")
    @RequireRole("Admin")
    public ResponseEntity<List<EnquiryResponseDTO>> getEnquiriesByCounsellor(@PathVariable Integer counsellorId) {
        return ResponseEntity.ok(enquiryService.getEnquiriesByCounsellor(counsellorId));
    }

    // Counsellor apni khud ki enquiries dekhega (logged-in user se)
    @GetMapping("/my")
    @RequireRole("Counsellor")
    public ResponseEntity<List<EnquiryResponseDTO>> getMyEnquiries() {
        return ResponseEntity.ok(enquiryService.getMyEnquiries());
    }

    // Sirf Admin - Phone/Website se aayi unassigned enquiries
    @GetMapping("/unassigned")
    @RequireRole("Admin")
    public ResponseEntity<List<EnquiryResponseDTO>> getUnassignedEnquiries() {
        return ResponseEntity.ok(enquiryService.getUnassignedEnquiries());
    }

    // Sirf Admin - saari enquiries
    @GetMapping
    @RequireRole("Admin")
    public ResponseEntity<List<EnquiryResponseDTO>> getAllEnquiries() {
    	    System.out.println("request come");
        return ResponseEntity.ok(enquiryService.getAllEnquiries());
    }

    // Sirf Admin - status ke hisaab se filter
    @GetMapping("/status/{status}")
    @RequireRole("Admin")
    public ResponseEntity<List<EnquiryResponseDTO>> getEnquiriesByStatus(@PathVariable Enquiry.Status status) {
        return ResponseEntity.ok(enquiryService.getEnquiriesByStatus(status));
    }
}