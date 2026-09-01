package com.crm.dto.request;

import com.crm.entity.Followup;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowupRequestDTO {

    private Integer enquiryId;
    private Followup.InteractionType interactionType;
    private LocalDate scheduledAt;
    private Followup.Outcome outcome;
    private String remarks;
    private LocalDate nextFollowupAt;
}