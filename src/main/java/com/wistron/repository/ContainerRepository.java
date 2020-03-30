package com.wistron.repository;

import java.util.List;

import com.wistron.model.GPU;
import com.wistron.model.Pod;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wistron.model.Container;

public interface ContainerRepository extends JpaRepository<Container, Long> {
	@Query(value = "SELECT u FROM Container u WHERE u.queryTime > :startDateTime AND u.queryTime < :endDateTime")
	List<Container> findAll(
			@Param("startDateTime") String startDateTime, 
			@Param("endDateTime") String endDateTime);

	@Query(value = "SELECT u FROM Container u WHERE u.podId = :podId AND u.queryTime > :startDateTime AND u.queryTime < :endDateTime")
	List<Container> findContainersByPodId(
			@Param("podId") Long podId, 
			@Param("startDateTime") String startDateTime, 
			@Param("endDateTime") String endDateTime);

    @Override
    List<Container> findAllById(Iterable<Long> iterable);
    List<Container> findContainersByPodId(Long podId);
}