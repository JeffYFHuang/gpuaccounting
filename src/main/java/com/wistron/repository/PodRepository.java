package com.wistron.repository;

import com.wistron.model.Pod;
import com.wistron.model.Process;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PodRepository extends JpaRepository<Pod, Long> {
	@Query(value = "SELECT u FROM Pod u WHERE u.queryTime > :startDateTime AND u.queryTime < :endDateTime")
	List<Pod> findAll(
			@Param("startDateTime") String startDateTime, 
			@Param("endDateTime") String endDateTime);

	@Query(value = "SELECT u FROM Pod u WHERE u.namespaceId = :namespaceId AND u.queryTime > :startDateTime AND u.queryTime < :endDateTime")
	List<Pod> findByNamespaceIdEquals(
			@Param("namespaceId") Long namespaceId, 
			@Param("startDateTime") String startDateTime, 
			@Param("endDateTime") String endDateTime);

    List<Pod> findByNamespaceIdEquals(Long namespaceId);
}