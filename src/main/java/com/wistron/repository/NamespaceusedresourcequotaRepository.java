package com.wistron.repository;

import com.wistron.model.Namespaceusedresourcequota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NamespaceusedresourcequotaRepository extends JpaRepository<Namespaceusedresourcequota, Long> {
    List<Namespaceusedresourcequota> findNamespaceusedresourcequotasByNamespaceId(Long namespaceId);
}