package com.crm.controller;

import com.crm.dto.request.FollowupRequestDTO;
import com.crm.dto.response.FollowupResponseDTO;
import com.crm.entity.Followup;
import com.crm.service.FollowupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/followups")
public class FollowupController {

    private final FollowupService followupService;

    @Autowired
    public FollowupController(FollowupService followupService) {
        this.followupService = followupService;
    }

    @PostMapping
    public ResponseEntity<FollowupResponseDTO> addFollowup(@RequestBody FollowupRequestDTO dto) {
        return ResponseEntity.status(201).body(followupService.addFollowup(dto));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<FollowupResponseDTO> markCompleted(
            @PathVariable Integer id,
            @RequestParam Followup.Outcome outcome,
            @RequestParam(required = false) String remarks) {
        return ResponseEntity.ok(followupService.markCompleted(id, outcome, remarks));
    }

    @GetMapping("/enquiry/{enquiryId}")
    public ResponseEntity<List<FollowupResponseDTO>> getByEnquiry(@PathVariable Integer enquiryId) {
        return ResponseEntity.ok(followupService.getFollowupsByEnquiry(enquiryId));
    }

    @GetMapping("/today")
    public ResponseEntity<List<FollowupResponseDTO>> getTodaysFollowups() {
        return ResponseEntity.ok(followupService.getTodaysFollowupsForCounsellor());
    }

    @GetMapping("/counsellor/{counsellorId}")
    public ResponseEntity<List<FollowupResponseDTO>> getByCounsellor(@PathVariable Integer counsellorId) {
        return ResponseEntity.ok(followupService.getAllFollowupsForCounsellor(counsellorId));
    }
}