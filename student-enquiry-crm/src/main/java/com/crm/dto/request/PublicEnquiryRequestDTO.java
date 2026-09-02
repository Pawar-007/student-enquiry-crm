package com.crm.dto.request;

import com.crm.entity.Enquiry;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicEnquiryRequestDTO {

    private String fullName;
    private String mobileNumber;
    private String alternateMobile;
    private String email;
    private String city;
    private Integer courseId;
    private Enquiry.CourseMode courseMode;
    private String budgetRange;
    // Note: enquirySource, priority, counsellor — sab jaan-bujhkar yahan nahi hain.
    // Public form se koi bhi ye control nahi kar sakta — server khud "Website" + "Warm" force karega.
}