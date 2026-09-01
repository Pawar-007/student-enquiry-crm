package com.crm.service.impl;

import com.crm.dto.response.CounsellorStatDTO;
import com.crm.dto.response.DashboardResponseDTO;
import com.crm.dto.response.SourceStatDTO;
import com.crm.entity.Enquiry;
import com.crm.entity.User;
import com.crm.repository.*;
import com.crm.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final EnquiryRepository enquiryRepository;
    private final PaymentRepository paymentRepository;

    @Autowired
    public DashboardServiceImpl(StudentRepository studentRepository,
                                 UserRepository userRepository,
                                 EnquiryRepository enquiryRepository,
                                 PaymentRepository paymentRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.enquiryRepository = enquiryRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public DashboardResponseDTO getAdminDashboard() {

        long totalStudents = studentRepository.count();
        long totalCounsellors = userRepository.countByRole(User.Role.Counsellor);
        long activeCounsellors = userRepository.countByRoleAndStatus(User.Role.Counsellor, User.UserStatus.Active);

        long totalEnquiries = enquiryRepository.count();
        long todaysEnquiries = enquiryRepository.countTodaysEnquiries();

        long admissionsDone = enquiryRepository.countByStatus(Enquiry.Status.Admission_Done);
        long notInterested = enquiryRepository.countByStatus(Enquiry.Status.Not_Interested);

        var totalRevenue = paymentRepository.getTotalRevenue();

        List<SourceStatDTO> sourceStats = enquiryRepository.countBySource()
                .stream()
                .map(row -> SourceStatDTO.builder()
                        .source(row[0].toString())
                        .count((Long) row[1])
                        .build())
                .collect(Collectors.toList());

        List<CounsellorStatDTO> counsellorStats = enquiryRepository.conversionCountByCounsellor()
                .stream()
                .map(row -> CounsellorStatDTO.builder()
                        .counsellorName(row[0] != null ? row[0].toString() : "Unassigned")
                        .conversionCount((Long) row[1])
                        .build())
                .collect(Collectors.toList());

        return DashboardResponseDTO.builder()
                .totalStudents(totalStudents)
                .totalCounsellors(totalCounsellors)
                .activeCounsellors(activeCounsellors)
                .totalEnquiries(totalEnquiries)
                .todaysEnquiries(todaysEnquiries)
                .admissionsDoneCount(admissionsDone)
                .notInterestedCount(notInterested)
                .totalRevenue(totalRevenue)
                .enquiriesBySource(sourceStats)
                .conversionsByCounsellor(counsellorStats)
                .build();
    }
}