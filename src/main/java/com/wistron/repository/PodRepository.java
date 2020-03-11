package com.wistron.repository;

import com.wistron.model.Pod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PodRepository extends JpaRepository<Pod, Long> {
    List<Pod> findByNamespaceIdEquals(Long namespaceId);
}