package com.wistron.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wistron.model.Container;
import com.wistron.model.GPU;
import com.wistron.repository.GPURepository;
import com.wistron.utils.ResponseEnvelope;

//@CrossOrigin(origins = "http://localhost:8081")
@RestController
//@RequestMapping("/api")
public class GPUController {

    @Autowired
    GPURepository gpuepository;

    @GetMapping("/gpus")
    public ResponseEntity<ResponseEnvelope<List<GPU> >> getAllGPUs(@RequestParam(value = "start", required = false) Long start,
			@RequestParam(value = "limit", required = false) Long limit,
			@RequestParam(value = "gpuId", required = false) Long gpuId) {
			try {
				List<GPU> GPUs = new ArrayList<GPU>();
				if (gpuId == null)
					gpuepository.findAll().forEach(GPUs::add);
				else
					GPUs.add(gpuepository.findById(gpuId).get());
				
				/*if (GPUs.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
				}*/
				
				return new ResponseEntity<>(new ResponseEnvelope<List<GPU> >(200, "success.", GPUs), HttpStatus.OK);
			} catch (Exception e) {
				return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
			}
    }

    @PostMapping("/gpus")
    public ResponseEntity<ResponseEnvelope<List<GPU> >> postAllGPUs(@RequestParam(value = "start", required = false) Long start,
    																@RequestParam(value = "limit", required = false) Long limit,
    																@RequestParam(value = "gpuId", required = false) Long gpuId) {
        try {
            List<GPU> GPUs = new ArrayList<GPU>();
            if (gpuId == null)
                gpuepository.findAll().forEach(GPUs::add);
            else
            	GPUs.add(gpuepository.findById(gpuId).get());

            /*if (GPUs.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }*/

            return new ResponseEntity<>(new ResponseEnvelope<List<GPU> >(200, "success.", GPUs), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/gpu/{id}")
    public ResponseEntity<GPU> getGPUById(@PathVariable("id") long id) {
        Optional<GPU> GPUData = gpuepository.findById(id);

        if (GPUData.isPresent()) {
            return new ResponseEntity<>(GPUData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}