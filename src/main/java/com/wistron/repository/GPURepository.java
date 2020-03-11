package com.wistron.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wistron.model.GPU;

public interface GPURepository extends JpaRepository<GPU, Long> {
    @Override
    List<GPU> findAllById(Iterable<Long> iterable);
    List<GPU> findGPUByHostname(String hostname);
    List<GPU> findGpuByUuid(String uuid);
}