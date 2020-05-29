package com.wistron.repository;

import com.wistron.model.Processmetric;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.List;

public interface ProcessmetricRepository extends JpaRepository<Processmetric, Long> {
	
	@Query(value = "SELECT u FROM Processmetric u WHERE u.queryTime > :startDateTime AND u.queryTime < :endDateTime")
	Page<Processmetric> findAll(
			@Param("startDateTime") String startDateTime, 
			@Param("endDateTime") String endDateTime, 
			Pageable paging);

	@Query(value = "SELECT u FROM Processmetric u WHERE u.processId = :processId AND u.queryTime > :startDateTime AND u.queryTime < :endDateTime")
	Page<Processmetric> findProcessesmetricByProcessId(
			@Param("processId") Long processId, 
			@Param("startDateTime") String startDateTime, 
			@Param("endDateTime") String endDateTime, 
			Pageable paging);
	
	@Query(value = "SELECT u FROM Processmetric u WHERE u.queryTime > :startDateTime AND u.queryTime < :endDateTime")
	List<Processmetric> findAll(
			@Param("startDateTime") String startDateTime, 
			@Param("endDateTime") String endDateTime
			);

	Page<Processmetric> findProcessesmetricByProcessId(Long processId, Pageable paging);
}