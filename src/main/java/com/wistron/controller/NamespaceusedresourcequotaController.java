package com.wistron.controller;

import com.wistron.model.Namespaceusedresourcequota;
import com.wistron.repository.NamespaceusedresourcequotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

//@CrossOrigin(origins = "http://localhost:8081")
@RestController
//@RequestMapping("/api")
public class NamespaceusedresourcequotaController {

    @Autowired
    NamespaceusedresourcequotaRepository namespaceusedresourcequotaRepository;

    @GetMapping("/namespaceusedresourcequotas")
    public ResponseEntity<List<Namespaceusedresourcequota>> getAllNamespaceusedresourcequotas(@RequestParam(required = false) Long namespaceId) {
        try {
            List<Namespaceusedresourcequota> namespaceusedresourcequotas = new ArrayList<Namespaceusedresourcequota>();
            if (namespaceId == null)
                namespaceusedresourcequotaRepository.findAll().forEach(namespaceusedresourcequotas::add);
            else
                namespaceusedresourcequotaRepository.findNamespaceusedresourcequotasByNamespaceId(namespaceId).forEach(namespaceusedresourcequotas::add);

            if (namespaceusedresourcequotas.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(namespaceusedresourcequotas, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/namespaceusedresourcequota/{id}")
    public ResponseEntity<Namespaceusedresourcequota> getNamespaceusedresourcequotaById(@PathVariable("id") long id) {
        Optional<Namespaceusedresourcequota> namespaceusedresourcequotaData = namespaceusedresourcequotaRepository.findById(id);

        if (namespaceusedresourcequotaData.isPresent()) {
            return new ResponseEntity<>(namespaceusedresourcequotaData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}