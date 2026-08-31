package com.crm.dto.response;

import com.crm.entity.Batch;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchResponseDTO {

    private Integer batchId;
    private CourseSummaryDTO course;
    private String batchName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String timing;
    private Batch.BatchStatus status;

    public static BatchResponseDTO fromEntity(Batch batch) {
        return BatchResponseDTO.builder()
                .batchId(batch.getBatchId())
                .course(CourseSummaryDTO.fromEntity(batch.getCourse()))
                .batchName(batch.getBatchName())
                .startDate(batch.getStartDate())
                .endDate(batch.getEndDate())
                .timing(batch.getTiming())
                .status(batch.getStatus())
                .build();
    }
}
