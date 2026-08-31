package com.crm.repository;

import com.crm.entity.Followup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface FollowupRepository extends JpaRepository<Followup, Integer> {

    List<Followup> findByEnquiry_EnquiryId(Integer enquiryId);

    // Counsellor ke aaj ke due follow-ups
    @Query("SELECT f FROM Followup f WHERE f.counsellor.userId = :counsellorId " +
           "AND FUNCTION('DATE', f.scheduledAt) = CURRENT_DATE " +
           "AND f.status = com.crm.entity.Followup$FollowupStatus.Scheduled")
    List<Followup> findTodaysFollowupsForCounsellor(@Param("counsellorId") Integer counsellorId);

    List<Followup> findByCounsellor_UserIdOrderByScheduledAtDesc(Integer counsellorId);
}