package com.crm.repository;

import com.crm.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, Integer> {

    List<Batch> findByCourse_CourseId(Integer courseId);

    List<Batch> findByStatus(Batch.BatchStatus status);
}