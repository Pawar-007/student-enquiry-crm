package com.crm.dto.request;

import com.crm.entity.Batch;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchRequestDTO {
    private Integer courseId;
    private String batchName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String timing;
    private Batch.BatchStatus status;
}