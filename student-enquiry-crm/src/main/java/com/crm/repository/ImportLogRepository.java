package com.crm.repository;

import com.crm.entity.ImportLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImportLogRepository extends JpaRepository<ImportLog, Integer> {
}