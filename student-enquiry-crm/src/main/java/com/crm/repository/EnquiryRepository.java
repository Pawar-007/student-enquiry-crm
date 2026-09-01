package com.crm.repository;

import com.crm.entity.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface EnquiryRepository extends JpaRepository<Enquiry, Integer> {

    // Counsellor apni assigned enquiries dekhe
    List<Enquiry> findByCounsellor_UserId(Integer counsellorId);

    // Status ke hisaab se filter
    List<Enquiry> findByStatus(Enquiry.Status status);

    List<Enquiry> findByCounsellor_UserIdAndStatus(Integer counsellorId, Enquiry.Status status);

    // Source ke hisaab se (phone/website wale jo abhi tak assign nahi hue)
    List<Enquiry> findByEnquirySourceAndCounsellorIsNull(Enquiry.EnquirySource source);

    Optional<Enquiry> findTopByMobileNumberOrderByCreatedAtDesc(String mobileNumber);

    // Admin dashboard: source-wise count
    @Query("SELECT e.enquirySource, COUNT(e) FROM Enquiry e GROUP BY e.enquirySource")
    List<Object[]> countBySource();

    // Admin dashboard: counsellor-wise conversion report
    @Query("SELECT e.counsellor.name, COUNT(e) FROM Enquiry e " +
           "WHERE e.status = com.crm.entity.Enquiry$Status.Admission_Done " +
           "GROUP BY e.counsellor.name")
    List<Object[]> conversionCountByCounsellor();

    // Total enquiries today
    @Query("SELECT COUNT(e) FROM Enquiry e WHERE FUNCTION('DATE', e.createdAt) = CURRENT_DATE")
    Long countTodaysEnquiries();
    
    long countByStatus(Enquiry.Status status);
}