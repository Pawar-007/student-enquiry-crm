package com.crm.service;

import com.crm.dto.response.EnquiryResponseDTO;
import com.crm.entity.Enquiry;
import java.util.List;

public interface EnquiryService {

    // source ke hisaab se assignment logic yahi handle hogi
    // Walk-in -> self-assign (loggedInCounsellorId se)
    // Phone/Website -> counsellor null rahega jab tak Admin assign na kare
    Enquiry createEnquiry(Enquiry enquiry, Integer createdByUserId);

    Enquiry updateEnquiryStatus(Integer enquiryId, Enquiry.Status newStatus, Integer changedByUserId);

    Enquiry assignCounsellor(Integer enquiryId, Integer counsellorId);

    Enquiry updatePriority(Integer enquiryId, Enquiry.Priority priority);

    Enquiry getEnquiryById(Integer enquiryId);

    List<EnquiryResponseDTO> getEnquiriesByCounsellor(Integer counsellorId);

    List<EnquiryResponseDTO> getUnassignedEnquiries();

    List<EnquiryResponseDTO> getAllEnquiries();

    List<EnquiryResponseDTO> getEnquiriesByStatus(Enquiry.Status status);
}