package com.crm.service;

import com.crm.dto.request.BatchRequestDTO;
import com.crm.dto.response.BatchResponseDTO;
import java.util.List;

public interface BatchService {
    BatchResponseDTO createBatch(BatchRequestDTO dto);
    
    BatchResponseDTO updateBatch(Integer batchId, BatchRequestDTO dto);
    
    List<BatchResponseDTO> getBatchesByCourse(Integer courseId);
    
    BatchResponseDTO getBatchById(Integer batchId);
}