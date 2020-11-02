package com.wistron.repository;

import com.wistron.model.Container;
import com.wistron.model.Namespaceusedresourcequota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NamespaceusedresourcequotaRepository extends JpaRepository<Namespaceusedresourcequota, Long> {
	@Query(value = "SELECT u FROM Namespaceusedresourcequota u WHERE (u.startTime < :startDateTime AND :endDateTime < u.queryTime) OR (:startDateTime < u.startTime AND u.startTime < :endDateTime) OR (:startDateTime < u.queryTime AND u.queryTime < :endDateTime )")
	List<Namespaceusedresourcequota> findAll(
			@Param("startDateTime") String startDateTime, 
			@Param("endDateTime") String endDateTime);

	@Query(value = "SELECT u FROM Namespaceusedresourcequota u WHERE u.namespaceId = :namespaceId AND ((u.startTime < :startDateTime AND :endDateTime < u.queryTime) OR (:startDateTime < u.startTime AND u.startTime < :endDateTime) OR (:startDateTime < u.queryTime AND u.queryTime < :endDateTime ))")
	List<Namespaceusedresourcequota> findNamespaceusedresourcequotasByNamespaceId(
			@Param("namespaceId") Long namespaceId, 
			@Param("startDateTime") String startDateTime, 
			@Param("endDateTime") String endDateTime);

	List<Namespaceusedresourcequota> findNamespaceusedresourcequotasByNamespaceId(Long namespaceId);
	
	@Query(value = "SELECT u FROM Namespaceusedresourcequota u WHERE u.namespaceId = :namespaceId order by u.id desc")
	List<Namespaceusedresourcequota> findTopByOrderByIdDesc(
			@Param("namespaceId") Long namespaceId);
}