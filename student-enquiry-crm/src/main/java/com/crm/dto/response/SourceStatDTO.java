package com.crm.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SourceStatDTO {
    private String source;
    private Long count;
}