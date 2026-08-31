package com.crm.service;

import com.crm.dto.response.BatchResponseDTO;
import com.crm.entity.Batch;
import java.util.List;

public interface BatchService {

    Batch createBatch(Batch batch);

    Batch updateBatch(Integer batchId, Batch batch);

    List<BatchResponseDTO> getBatchesByCourse(Integer courseId);

    Batch getBatchById(Integer batchId);
}