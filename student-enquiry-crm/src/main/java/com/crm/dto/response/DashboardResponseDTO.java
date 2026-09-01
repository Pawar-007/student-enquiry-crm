package com.crm.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponseDTO {

    private Long totalStudents;
    private Long totalCounsellors;
    private Long activeCounsellors;

    private Long totalEnquiries;
    private Long todaysEnquiries;

    private Long admissionsDoneCount;      // conversions
    private Long notInterestedCount;       // cancellations

    private BigDecimal totalRevenue;

    private List<SourceStatDTO> enquiriesBySource;
    private List<CounsellorStatDTO> conversionsByCounsellor;
}