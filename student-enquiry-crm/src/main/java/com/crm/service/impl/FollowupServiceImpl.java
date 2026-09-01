package com.crm.service.impl;

import com.crm.dto.request.FollowupRequestDTO;
import com.crm.dto.response.FollowupResponseDTO;
import com.crm.entity.Enquiry;
import com.crm.entity.Followup;
import com.crm.entity.User;
import com.crm.repository.EnquiryRepository;
import com.crm.repository.FollowupRepository;
import com.crm.repository.UserRepository;
import com.crm.security.CurrentUserContext;
import com.crm.service.FollowupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowupServiceImpl implements FollowupService {

    private final FollowupRepository followupRepository;
    private final EnquiryRepository enquiryRepository;
    private final UserRepository userRepository;

    @Autowired
    public FollowupServiceImpl(FollowupRepository followupRepository,
                                EnquiryRepository enquiryRepository,
                                UserRepository userRepository) {
        this.followupRepository = followupRepository;
        this.enquiryRepository = enquiryRepository;
        this.userRepository = userRepository;
    }

    @Override
    public FollowupResponseDTO addFollowup(FollowupRequestDTO dto) {
        if (dto.getEnquiryId() == null) {
            throw new IllegalArgumentException("Enquiry ID is required");
        }

        Enquiry enquiry = enquiryRepository.findById(dto.getEnquiryId())
                .orElseThrow(() -> new RuntimeException("Enquiry not found with id: " + dto.getEnquiryId()));

        var currentUser = CurrentUserContext.get();

        // Ownership check - Counsellor sirf apni enquiry pe followup daal sake
        if ("Counsellor".equalsIgnoreCase(currentUser.getRole())) {
            if (enquiry.getCounsellor() == null ||
                !enquiry.getCounsellor().getUserId().equals(currentUser.getUserId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "You can only add follow-ups to your own enquiries");
            }
        }

        User counsellor = userRepository.findById(currentUser.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Followup followup = Followup.builder()
                .enquiry(enquiry)
                .counsellor(counsellor)
                .interactionType(dto.getInteractionType() != null ? dto.getInteractionType() : Followup.InteractionType.Call)
                .scheduledAt(dto.getScheduledAt() != null ? dto.getScheduledAt() : LocalDate.now())
                .outcome(dto.getOutcome())
                .remarks(dto.getRemarks())
                .nextFollowupAt(dto.getNextFollowupAt())
                .status(Followup.FollowupStatus.Scheduled)
                .build();

        Followup saved = followupRepository.save(followup);
        return FollowupResponseDTO.fromEntity(saved);
    }

    @Override
    public FollowupResponseDTO markCompleted(Integer followupId, Followup.Outcome outcome, String remarks) {
        Followup followup = followupRepository.findById(followupId)
                .orElseThrow(() -> new RuntimeException("Followup not found with id: " + followupId));

        var currentUser = CurrentUserContext.get();
        if ("Counsellor".equalsIgnoreCase(currentUser.getRole())
                && !followup.getCounsellor().getUserId().equals(currentUser.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You can only complete your own follow-ups");
        }

        followup.setCompletedAt(LocalDate.now());
        followup.setOutcome(outcome);
        followup.setRemarks(remarks);
        followup.setStatus(Followup.FollowupStatus.Completed);

        Followup updated = followupRepository.save(followup);
        return FollowupResponseDTO.fromEntity(updated);
    }

    @Override
    public List<FollowupResponseDTO> getFollowupsByEnquiry(Integer enquiryId) {
        return followupRepository.findByEnquiry_EnquiryId(enquiryId)
                .stream()
                .map(FollowupResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<FollowupResponseDTO> getTodaysFollowupsForCounsellor() {
        Integer loggedInUserId = CurrentUserContext.get().getUserId();
        return followupRepository.findTodaysFollowupsForCounsellor(loggedInUserId)
                .stream()
                .map(FollowupResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<FollowupResponseDTO> getAllFollowupsForCounsellor(Integer counsellorId) {
        return followupRepository.findByCounsellor_UserIdOrderByScheduledAtDesc(counsellorId)
                .stream()
                .map(FollowupResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

}