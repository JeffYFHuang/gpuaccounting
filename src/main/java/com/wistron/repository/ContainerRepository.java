package com.wistron.repository;

import java.util.List;

import com.wistron.model.GPU;
import org.springframework.data.jpa.repository.JpaRepository;

import com.wistron.model.Container;

public interface ContainerRepository extends JpaRepository<Container, Long> {
    @Override
    List<Container> findAllById(Iterable<Long> iterable);
    List<Container> findContainersByPodId(Long podId);
}