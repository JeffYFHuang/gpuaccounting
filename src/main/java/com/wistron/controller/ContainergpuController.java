package com.wistron.controller;

import com.wistron.model.Containergpu;
import com.wistron.repository.ContainergpuRepository;
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
public class ContainergpuController {

    @Autowired
    ContainergpuRepository containergpuRepository;

    @GetMapping("/containergpus")
    public ResponseEntity<List<Containergpu>> getAllContaingpus(@RequestParam(required = false) Long podId) {
        try {
            List<Containergpu> containergpus = new ArrayList<Containergpu>();
            if (podId == null)
                containergpuRepository.findAll().forEach(containergpus::add);
            else
                containergpuRepository.findContainergpusByPodId(podId).forEach(containergpus::add);

            if (containergpus.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(containergpus, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/containergpu/{id}")
    public ResponseEntity<Containergpu> getContainergpuById(@PathVariable("id") long id) {
        Optional<Containergpu> ContainergpuData = containergpuRepository.findById(id);

        if (ContainergpuData.isPresent()) {
            return new ResponseEntity<>(ContainergpuData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}