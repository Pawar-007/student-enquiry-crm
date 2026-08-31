package com.crm.dto.response;

import com.crm.entity.Batch;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchSummaryDTO {

    private Integer batchId;
    private String batchName;

    public static BatchSummaryDTO fromEntity(Batch batch) {
        if (batch == null) return null;
        return BatchSummaryDTO.builder()
                .batchId(batch.getBatchId())
                .batchName(batch.getBatchName())
                .build();
    }
}