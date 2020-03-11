package com.wistron.repository;

import com.wistron.model.Namespace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NamespaceRepository extends JpaRepository<Namespace, Long> {
    List<Namespace> findNamespaceByOwner(String email);
}