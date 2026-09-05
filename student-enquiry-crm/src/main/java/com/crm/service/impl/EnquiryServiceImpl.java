package com.crm.service.impl;

import com.crm.dto.request.EnquiryRequestDTO;
import com.crm.dto.request.PublicEnquiryRequestDTO;
import com.crm.dto.response.EnquiryResponseDTO;
import com.crm.entity.Course;
import com.crm.entity.Enquiry;
import com.crm.entity.User;
import com.crm.repository.CourseRepository;
import com.crm.repository.EnquiryRepository;
import com.crm.repository.UserRepository;
import com.crm.security.CurrentUserContext;
import com.crm.service.EnquiryService;
import com.crm.util.CommonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnquiryServiceImpl implements EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public EnquiryServiceImpl(EnquiryRepository enquiryRepository,
                               UserRepository userRepository,
                               CourseRepository courseRepository) {
        this.enquiryRepository = enquiryRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public EnquiryResponseDTO createEnquiry(EnquiryRequestDTO dto, Integer createdByUserId, String createdByRole) {

        if (dto.getFullName() == null || dto.getFullName().isBlank()) {
            throw new IllegalArgumentException("Full name is required");
        }
        if (dto.getMobileNumber() == null || dto.getMobileNumber().isBlank()) {
            throw new IllegalArgumentException("Mobile number is required");
        }
        if (dto.getEnquirySource() == null) {
            throw new IllegalArgumentException("Enquiry source is required");
        }

        Course course = null;
        if (dto.getCourseId() != null) {
            course = courseRepository.findById(dto.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Course not found with id: " + dto.getCourseId()));
        }

        Enquiry enquiry = Enquiry.builder()
                .fullName(dto.getFullName())
                .mobileNumber(dto.getMobileNumber())
                .alternateMobile(dto.getAlternateMobile())
                .email(dto.getEmail())
                .city(dto.getCity())
                .course(course)
                .courseMode(dto.getCourseMode())
                .budgetRange(dto.getBudgetRange())
                .enquirySource(dto.getEnquirySource())
                .priority(dto.getPriority() != null ? dto.getPriority() : Enquiry.Priority.Warm)
                .build();

        // ===== Source-based assignment logic =====
        if (dto.getEnquirySource() == Enquiry.EnquirySource.Walk_in) {
            // Walk-in: jo counsellor handle kar raha hai, wahi self-assign hoga
            if (!"Counsellor".equalsIgnoreCase(createdByRole)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Walk-in enquiries must be created by a Counsellor (self-assignment)");
            }
            User counsellor = userRepository.findById(createdByUserId)
                    .orElseThrow(() -> new RuntimeException("Counsellor not found"));
            enquiry.setCounsellor(counsellor);
        } else {
            // Phone Call / Website: counsellor abhi null rahega, Admin baad me assign karega
            enquiry.setCounsellor(null);
        }

        Enquiry savedEnquiry = enquiryRepository.save(enquiry);
        return EnquiryResponseDTO.fromEntity(savedEnquiry);
    }

    @Override
    public EnquiryResponseDTO updateEnquiryStatus(Integer enquiryId, Enquiry.Status newStatus) {
        Enquiry enquiry = getEnquiryOwnedOrThrow(enquiryId);
        enquiry.setStatus(newStatus);
        Enquiry updated = enquiryRepository.save(enquiry);
        return EnquiryResponseDTO.fromEntity(updated);
    }

    @Override
    public EnquiryResponseDTO assignCounsellor(Integer enquiryId, Integer counsellorId) {
        Enquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() -> new RuntimeException("Enquiry not found with id: " + enquiryId));

        User counsellor = userRepository.findById(counsellorId)
                .orElseThrow(() -> new RuntimeException("Counsellor not found with id: " + counsellorId));

        if (counsellor.getRole() != User.Role.Counsellor) {
            throw new IllegalArgumentException("Assigned user must have Counsellor role");
        }

        enquiry.setCounsellor(counsellor);
        Enquiry updated = enquiryRepository.save(enquiry);
        return EnquiryResponseDTO.fromEntity(updated);
    }

    @Override
    public EnquiryResponseDTO updatePriority(Integer enquiryId, Enquiry.Priority priority) {
        Enquiry enquiry = getEnquiryOwnedOrThrow(enquiryId);
        enquiry.setPriority(priority);
        Enquiry updated = enquiryRepository.save(enquiry);
        return EnquiryResponseDTO.fromEntity(updated);
    }

    @Override
    public EnquiryResponseDTO getEnquiryById(Integer enquiryId) {
        Enquiry enquiry = getEnquiryOwnedOrThrow(enquiryId);
        return EnquiryResponseDTO.fromEntity(enquiry);
    }

    @Override
    public List<EnquiryResponseDTO> getEnquiriesByCounsellor(Integer counsellorId) {
        return enquiryRepository.findByCounsellor_UserId(counsellorId)
                .stream()
                .map(EnquiryResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<EnquiryResponseDTO> getMyEnquiries() {
        Integer loggedInUserId = CurrentUserContext.get().getUserId();
        return getEnquiriesByCounsellor(loggedInUserId);
    }

    @Override
    public List<EnquiryResponseDTO> getUnassignedEnquiries() {

        return enquiryRepository.findByCounsellorIsNull()
                .stream()
                .map(EnquiryResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<EnquiryResponseDTO> getAllEnquiries() {
    	    System.out.print("request come to service");
    	    List<EnquiryResponseDTO> li=enquiryRepository.findAll()
                    .stream()
                    .map(EnquiryResponseDTO::fromEntity)
                    .collect(Collectors.toList());
        return li;
    }

    @Override
    public List<EnquiryResponseDTO> getEnquiriesByStatus(Enquiry.Status status) {
        return enquiryRepository.findByStatus(status)
                .stream()
                .map(EnquiryResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ===== Helper: ownership check =====
    // Admin kisi bhi enquiry ko access kar sakta hai.
    // Counsellor sirf apni assigned enquiry access kar sakta hai.
    private Enquiry getEnquiryOwnedOrThrow(Integer enquiryId) {
        Enquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() -> new RuntimeException("Enquiry not found with id: " + enquiryId));

        var currentUser = CurrentUserContext.get();
        if ("Counsellor".equalsIgnoreCase(currentUser.getRole())) {
            if (enquiry.getCounsellor() == null ||
                !enquiry.getCounsellor().getUserId().equals(currentUser.getUserId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "You can only access your own enquiries");
            }
        }
        return enquiry;
    }

 // EnquiryServiceImpl mein add karo
    @Override
    public EnquiryResponseDTO createPublicEnquiry(PublicEnquiryRequestDTO dto) {

        if (dto.getFullName() == null || dto.getFullName().isBlank()) {
            throw new IllegalArgumentException("Full name is required");
        }
        if (dto.getMobileNumber() == null || dto.getMobileNumber().isBlank()) {
            throw new IllegalArgumentException("Mobile number is required");
        }

        Course course = null;
        if (dto.getCourseId() != null) {
            course = courseRepository.findById(dto.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Course not found with id: " + dto.getCourseId()));
        }

        Enquiry enquiry = Enquiry.builder()
                .fullName(dto.getFullName())
                .mobileNumber(dto.getMobileNumber())
                .alternateMobile(dto.getAlternateMobile())
                .email(dto.getEmail())
                .city(dto.getCity())
                .course(course)
                .courseMode(dto.getCourseMode())
                .budgetRange(dto.getBudgetRange())
                .enquirySource(Enquiry.EnquirySource.Website)   // server-forced, client control nahi kar sakta
                .priority(Enquiry.Priority.Warm)                // default
                .counsellor(null)                               // Admin baad me assign karega
                .build();

        Enquiry saved = enquiryRepository.save(enquiry);
        return EnquiryResponseDTO.fromEntity(saved);
    }
    
    
}