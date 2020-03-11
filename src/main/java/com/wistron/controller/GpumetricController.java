package com.wistron.controller;

import com.wistron.model.Gpumetric;
import com.wistron.repository.GpumetricRepository;
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
public class GpumetricController {

    @Autowired
    GpumetricRepository gpumetricRepository;

    @GetMapping("/gpumetrics")
    public ResponseEntity<List<Gpumetric>> getAllGPUMetrics(@RequestParam(required = false) Long gpuId) {
        try {
            List<Gpumetric> gpumetrics = new ArrayList<Gpumetric>();
            if (gpuId == null)
                gpumetricRepository.findAll().forEach(gpumetrics::add);
            else
                gpumetricRepository.findGpumetricByGpuId(gpuId).forEach(gpumetrics::add);

            if (gpumetrics.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(gpumetrics, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/gpumetric/{id}")
    public ResponseEntity<Gpumetric> getGPUMetricById(@PathVariable("id") long id) {
        Optional<Gpumetric> GpumetricData = gpumetricRepository.findById(id);

        if (GpumetricData.isPresent()) {
            return new ResponseEntity<>(GpumetricData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}