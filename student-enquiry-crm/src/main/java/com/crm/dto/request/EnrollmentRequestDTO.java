package com.crm.dto.request;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentRequestDTO {

    private Integer enquiryId;
    private Integer courseId;
    private BigDecimal totalFees;
    private Integer batchId;   // optional
}