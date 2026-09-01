package com.crm.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounsellorStatDTO {
    private String counsellorName;
    private Long conversionCount;
}