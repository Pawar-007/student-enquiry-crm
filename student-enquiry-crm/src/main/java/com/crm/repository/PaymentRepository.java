package com.crm.repository;

import com.crm.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    List<Payment> findByEnrollment_EnrollmentId(Integer enrollmentId);

    // Admin dashboard: total revenue
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p")
    BigDecimal getTotalRevenue();
}