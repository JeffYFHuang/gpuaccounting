package com.wistron.controller;

import com.wistron.model.Container;
import com.wistron.repository.ContainerRepository;
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
public class ContainerController {

    @Autowired
    ContainerRepository containerRepository;

    @GetMapping("/containers")
    public ResponseEntity<List<Container>> getAllContainers(@RequestParam(required = false) Long podId) {
        try {
            List<Container> containers = new ArrayList<Container>();
            if (podId == null)
                containerRepository.findAll().forEach(containers::add);
            else
                containerRepository.findContainersByPodId(podId).forEach(containers::add);

            if (containers.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(containers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/container/{id}")
    public ResponseEntity<Container> getContainerById(@PathVariable("id") long id) {
        Optional<Container> ContainerData = containerRepository.findById(id);

        if (ContainerData.isPresent()) {
            return new ResponseEntity<>(ContainerData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}