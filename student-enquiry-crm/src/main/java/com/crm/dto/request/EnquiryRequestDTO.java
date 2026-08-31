package com.crm.dto.request;

import com.crm.entity.Enquiry;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnquiryRequestDTO {

    private String fullName;

    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobileNumber;

    @Pattern(regexp = "^[0-9]{10}$", message = "Alternate mobile must be 10 digits")
    private String alternateMobile;

    private String email;

    private String city;

    private Integer courseId;

    private Enquiry.CourseMode courseMode;

    private String budgetRange;

    // CREATE ke waqt required hai - assignment logic isi par depend karti hai
    private Enquiry.EnquirySource enquirySource;

    private Enquiry.Priority priority;
}