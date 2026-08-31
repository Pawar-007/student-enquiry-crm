package com.crm.service;

import com.crm.dto.request.EnquiryRequestDTO;
import com.crm.dto.response.EnquiryResponseDTO;
import com.crm.entity.Enquiry;
import java.util.List;

public interface EnquiryService {

    // Assignment logic yahin handle hogi:
    // Walk-in -> creator (Counsellor) khud assign ho jayega
    // Phone Call / Website -> counsellor null rahega, Admin baad me assignCounsellor() se assign karega
    EnquiryResponseDTO createEnquiry(EnquiryRequestDTO dto, Integer createdByUserId, String createdByRole);

    EnquiryResponseDTO updateEnquiryStatus(Integer enquiryId, Enquiry.Status newStatus);

    // Admin only
    EnquiryResponseDTO assignCounsellor(Integer enquiryId, Integer counsellorId);

    EnquiryResponseDTO updatePriority(Integer enquiryId, Enquiry.Priority priority);

    // Ownership check andar hoga - Counsellor sirf apni enquiry dekh sake
    EnquiryResponseDTO getEnquiryById(Integer enquiryId);

    List<EnquiryResponseDTO> getEnquiriesByCounsellor(Integer counsellorId);

    List<EnquiryResponseDTO> getMyEnquiries(); // logged-in Counsellor ki apni list

    // Admin only
    List<EnquiryResponseDTO> getUnassignedEnquiries();

    // Admin only
    List<EnquiryResponseDTO> getAllEnquiries();

    List<EnquiryResponseDTO> getEnquiriesByStatus(Enquiry.Status status);
}