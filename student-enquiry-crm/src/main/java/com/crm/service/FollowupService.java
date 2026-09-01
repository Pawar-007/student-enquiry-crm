package com.crm.service;

import com.crm.dto.request.FollowupRequestDTO;
import com.crm.dto.response.FollowupResponseDTO;
import com.crm.entity.Followup;
import java.util.List;

public interface FollowupService {

	FollowupResponseDTO addFollowup(FollowupRequestDTO followup);

	FollowupResponseDTO markCompleted(Integer followupId, Followup.Outcome outcome, String remarks);

    List<FollowupResponseDTO> getFollowupsByEnquiry(Integer enquiryId);

    List<FollowupResponseDTO> getTodaysFollowupsForCounsellor();

    List<FollowupResponseDTO> getAllFollowupsForCounsellor(Integer counsellorId);
}