package com.crm.controller;

import com.crm.dto.request.PaymentRequestDTO;
import com.crm.dto.response.PaymentResponseDTO;
import com.crm.security.RequireRole;
import com.crm.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponseDTO> addPayment(@RequestBody PaymentRequestDTO dto) {
        return ResponseEntity.status(201).body(paymentService.addPayment(dto));
    }

    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<List<PaymentResponseDTO>> getByEnrollment(@PathVariable Integer enrollmentId) {
        return ResponseEntity.ok(paymentService.getPaymentsByEnrollment(enrollmentId));
    }

    @GetMapping("/enrollment/{enrollmentId}/paid")
    public ResponseEntity<BigDecimal> getPaidAmount(@PathVariable Integer enrollmentId) {
        return ResponseEntity.ok(paymentService.getPaidAmount(enrollmentId));
    }

    @GetMapping("/enrollment/{enrollmentId}/pending")
    public ResponseEntity<BigDecimal> getPendingAmount(@PathVariable Integer enrollmentId) {
        return ResponseEntity.ok(paymentService.getPendingAmount(enrollmentId));
    }

    // Sirf Admin - total revenue dashboard ke liye
    @GetMapping("/revenue")
    @RequireRole("Admin")
    public ResponseEntity<BigDecimal> getTotalRevenue() {
        return ResponseEntity.ok(paymentService.getTotalRevenue());
    }
}