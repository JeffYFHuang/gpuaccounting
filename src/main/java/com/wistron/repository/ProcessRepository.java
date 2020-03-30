package com.wistron.repository;

import com.wistron.model.Process;
import com.wistron.model.Processmetric;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProcessRepository extends JpaRepository<Process, Long> {
	@Query(value = "SELECT u FROM Process u WHERE u.queryTime > :startDateTime AND u.queryTime < :endDateTime")
	List<Process> findAll(
			@Param("startDateTime") String startDateTime, 
			@Param("endDateTime") String endDateTime);

	@Query(value = "SELECT u FROM Process u WHERE u.containerId = :containerId AND u.queryTime > :startDateTime AND u.queryTime < :endDateTime")
	List<Process> findProcessesByContainerId(
			@Param("containerId") Long containerId, 
			@Param("startDateTime") String startDateTime, 
			@Param("endDateTime") String endDateTime);

    List<Process> findProcessesByContainerId(Long containerId);
}