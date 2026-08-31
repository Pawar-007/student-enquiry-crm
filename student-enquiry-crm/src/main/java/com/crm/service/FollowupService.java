package com.crm.service;

import com.crm.dto.response.FollowupResponseDTO;
import com.crm.entity.Followup;
import java.util.List;

public interface FollowupService {

    Followup addFollowup(Followup followup);

    Followup markCompleted(Integer followupId, Followup.Outcome outcome, String remarks);

    List<FollowupResponseDTO> getFollowupsByEnquiry(Integer enquiryId);

    List<FollowupResponseDTO> getTodaysFollowupsForCounsellor(Integer counsellorId);

    List<FollowupResponseDTO> getAllFollowupsForCounsellor(Integer counsellorId);
}