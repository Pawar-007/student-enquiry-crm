package com.crm.dto.response;

import com.crm.entity.Followup;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowupResponseDTO {

    private Integer followupId;
    private EnquirySummaryDTO enquiry;      // pura Enquiry nahi
    private UserSummaryDTO counsellor;
    private Followup.InteractionType interactionType;
    private LocalDate scheduledAt;
    private LocalDate completedAt;
    private Followup.Outcome outcome;
    private String remarks;
    private LocalDate nextFollowupAt;
    private Followup.FollowupStatus status;
    private LocalDateTime createdAt;

    public static FollowupResponseDTO fromEntity(Followup followup) {
        return FollowupResponseDTO.builder()
                .followupId(followup.getFollowupId())
                .enquiry(EnquirySummaryDTO.fromEntity(followup.getEnquiry()))
                .counsellor(UserSummaryDTO.fromEntity(followup.getCounsellor()))
                .interactionType(followup.getInteractionType())
                .scheduledAt(followup.getScheduledAt())
                .completedAt(followup.getCompletedAt())
                .outcome(followup.getOutcome())
                .remarks(followup.getRemarks())
                .nextFollowupAt(followup.getNextFollowupAt())
                .status(followup.getStatus())
                .createdAt(followup.getCreatedAt())
                .build();
    }
}