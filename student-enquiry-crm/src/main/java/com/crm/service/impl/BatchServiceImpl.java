package com.crm.service.impl;

import com.crm.dto.request.BatchRequestDTO;
import com.crm.dto.response.BatchResponseDTO;
import com.crm.entity.Batch;
import com.crm.entity.Course;
import com.crm.repository.BatchRepository;
import com.crm.repository.CourseRepository;
import com.crm.service.BatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BatchServiceImpl implements BatchService {

    private final BatchRepository batchRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public BatchServiceImpl(BatchRepository batchRepository, CourseRepository courseRepository) {
        this.batchRepository = batchRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public BatchResponseDTO createBatch(BatchRequestDTO dto) {
        if (dto.getCourseId() == null) {
            throw new IllegalArgumentException("Course ID is required");
        }
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + dto.getCourseId()));

        Batch batch = Batch.builder()
                .course(course)
                .batchName(dto.getBatchName())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .timing(dto.getTiming())
                .status(dto.getStatus() != null ? dto.getStatus() : Batch.BatchStatus.Upcoming)
                .build();

        return BatchResponseDTO.fromEntity(batchRepository.save(batch));
    }

    @Override
    public BatchResponseDTO updateBatch(Integer batchId, BatchRequestDTO dto) {
        Batch existing = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found with id: " + batchId));

        if (dto.getBatchName() != null) existing.setBatchName(dto.getBatchName());
        if (dto.getStartDate() != null) existing.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) existing.setEndDate(dto.getEndDate());
        if (dto.getTiming() != null) existing.setTiming(dto.getTiming());
        if (dto.getStatus() != null) existing.setStatus(dto.getStatus());

        return BatchResponseDTO.fromEntity(batchRepository.save(existing));
    }

    @Override
    public List<BatchResponseDTO> getBatchesByCourse(Integer courseId) {
        return batchRepository.findByCourse_CourseId(courseId)
                .stream()
                .map(BatchResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public BatchResponseDTO getBatchById(Integer batchId) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found with id: " + batchId));
        return BatchResponseDTO.fromEntity(batch);
    }
}