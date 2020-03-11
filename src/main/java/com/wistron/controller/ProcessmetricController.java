package com.wistron.controller;

import com.wistron.model.Processmetric;
import com.wistron.repository.ProcessmetricRepository;
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
public class ProcessmetricController {

    @Autowired
    ProcessmetricRepository processmetricRepository;

    @GetMapping("/processmetrics")
    public ResponseEntity<List<Processmetric>> getAllProcessMetrics(@RequestParam(required = false) Long processId) {
        try {
            List<Processmetric> processmetrics = new ArrayList<Processmetric>();
            if (processId == null)
                processmetricRepository.findAll().forEach(processmetrics::add);
            else
                processmetricRepository.findProcessesmetricByProcessId(processId).forEach(processmetrics::add);

            if (processmetrics.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(processmetrics, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/processmetric/{id}")
    public ResponseEntity<Processmetric> getProcessMetricById(@PathVariable("id") long id) {
        Optional<Processmetric> processmetricData = processmetricRepository.findById(id);

        if (processmetricData.isPresent()) {
            return new ResponseEntity<>(processmetricData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}