package com.wistron.repository;

import com.wistron.model.Processmetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProcessmetricRepository extends JpaRepository<Processmetric, Long> {
    List<Processmetric> findProcessesmetricByProcessId(Long processId);
}