package com.wistron.repository;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wistron.model.Gpumetric;
import com.wistron.model.Namespaceusedresourcequota;
import com.wistron.model.Processmetric;

public interface GpumetricRepository extends JpaRepository<Gpumetric, Long> {
    List<Gpumetric> findGpumetricByGpuId(Long gpuId);

	@Query(value = "SELECT u FROM Gpumetric u WHERE u.gpuId = :gpuId AND (u.queryTime >= :startDateTime AND :endDateTime > u.queryTime)")
	List<Gpumetric> findGpumetricsByGpuId(
			@Param("gpuId") Long gpuId, 
			@Param("startDateTime") String startDateTime, 
			@Param("endDateTime") String endDateTime);
}