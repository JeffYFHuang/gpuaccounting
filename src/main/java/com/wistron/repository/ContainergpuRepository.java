package com.wistron.repository;

import java.util.List;

import com.wistron.model.Containergpu;
import org.springframework.data.jpa.repository.JpaRepository;

import com.wistron.model.Container;

public interface ContainergpuRepository extends JpaRepository<Containergpu, Long> {
    @Override
    List<Containergpu> findAllById(Iterable<Long> iterable);
    List<Containergpu> findContainergpusByContainerId(Long ContainerId);
    List<Containergpu> findContainergpusByPodId(Long PodId);
}