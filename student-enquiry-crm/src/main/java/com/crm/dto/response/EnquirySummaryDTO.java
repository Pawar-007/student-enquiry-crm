package com.crm.dto.response;

import com.crm.entity.Enquiry;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnquirySummaryDTO {

    private Integer enquiryId;
    private String fullName;
    private String mobileNumber;
    private Enquiry.Status status;

    public static EnquirySummaryDTO fromEntity(Enquiry enquiry) {
        if (enquiry == null) return null;
        return EnquirySummaryDTO.builder()
                .enquiryId(enquiry.getEnquiryId())
                .fullName(enquiry.getFullName())
                .mobileNumber(enquiry.getMobileNumber())
                .status(enquiry.getStatus())
                .build();
    }
}