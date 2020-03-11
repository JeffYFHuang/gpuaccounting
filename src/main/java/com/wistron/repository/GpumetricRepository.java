package com.wistron.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wistron.model.Gpumetric;

public interface GpumetricRepository extends JpaRepository<Gpumetric, Long> {
    List<Gpumetric> findGpumetricByGpuId(Long gpuId);
}