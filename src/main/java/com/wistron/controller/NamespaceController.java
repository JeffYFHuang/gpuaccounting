package com.wistron.controller;

import com.wistron.model.GPU;
import com.wistron.model.Namespace;
import com.wistron.repository.NamespaceRepository;
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
public class NamespaceController {

    @Autowired
    NamespaceRepository namespaceRepository;

    @GetMapping("/namespaces")
    public ResponseEntity<List<Namespace>> getAllNamespaces(@RequestParam(required = false) String email) {
        try {
            List<Namespace> namespaces = new ArrayList<Namespace>();
            if (email == null)
                namespaceRepository.findAll().forEach(namespaces::add);
            else
                namespaceRepository.findNamespaceByOwner(email).forEach(namespaces::add);

            if (namespaces.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(namespaces, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/namespace/{id}")
    public ResponseEntity<Namespace> getNamespaceById(@PathVariable("id") long id) {
        Optional<Namespace> NamespaceData = namespaceRepository.findById(id);

        if (NamespaceData.isPresent()) {
            return new ResponseEntity<>(NamespaceData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}