package com.wistron.repository;

import com.wistron.model.Process;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProcessRepository extends JpaRepository<Process, Long> {
    List<Process> findProcessesByContainerId(Long containerId);
}