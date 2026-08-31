package com.crm.dto.response;

import com.crm.entity.Enquiry;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnquiryResponseDTO {

    private Integer enquiryId;
    private String fullName;
    private String mobileNumber;
    private String alternateMobile;
    private String email;
    private String city;
    private CourseSummaryDTO course;         // pura Course nahi
    private Enquiry.CourseMode courseMode;
    private String budgetRange;
    private Enquiry.EnquirySource enquirySource;
    private Enquiry.Status status;
    private Enquiry.Priority priority;
    private UserSummaryDTO counsellor;       // pura User nahi
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static EnquiryResponseDTO fromEntity(Enquiry enquiry) {
        return EnquiryResponseDTO.builder()
                .enquiryId(enquiry.getEnquiryId())
                .fullName(enquiry.getFullName())
                .mobileNumber(enquiry.getMobileNumber())
                .alternateMobile(enquiry.getAlternateMobile())
                .email(enquiry.getEmail())
                .city(enquiry.getCity())
                .course(CourseSummaryDTO.fromEntity(enquiry.getCourse()))
                .courseMode(enquiry.getCourseMode())
                .budgetRange(enquiry.getBudgetRange())
                .enquirySource(enquiry.getEnquirySource())
                .status(enquiry.getStatus())
                .priority(enquiry.getPriority())
                .counsellor(UserSummaryDTO.fromEntity(enquiry.getCounsellor()))
                .createdAt(enquiry.getCreatedAt())
                .updatedAt(enquiry.getUpdatedAt())
                .build();
    }
}