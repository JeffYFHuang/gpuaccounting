package com.wistron.controller;

import com.wistron.model.Namespace;
import com.wistron.model.Pod;
import com.wistron.model.Process;
import com.wistron.model.Processmetric;
import com.wistron.repository.PodRepository;
import com.wistron.utils.ResponseEnvelope;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

//@CrossOrigin(origins = "http://localhost:8081")
@RestController
//@RequestMapping("/api")
public class PodController {

    @Autowired
    PodRepository podrepository;

    @GetMapping("/pods")
    public ResponseEntity<ResponseEnvelope<List<Pod>>> getAllPods(
    		@RequestParam(required = false) Long namespaceId,
    		@RequestParam(value = "start", required = false) Long start,
			@RequestParam(value = "limit", required = false) Long limit,
			@RequestParam(value = "startDateTime", required = false) String startDateTime,
			@RequestParam(value = "endDateTime", required = false) String endDateTime) {
        try {
        	List<Pod> pods = new ArrayList<Pod>();
            if (namespaceId == null) {
            	if (startDateTime == null & startDateTime == null)
            		podrepository.findAll().forEach(pods::add);
            	else
            		podrepository.findAll(startDateTime, endDateTime).forEach(pods::add);
            }
            else
            	if (startDateTime == null & startDateTime == null)
            		podrepository.findByNamespaceIdEquals(namespaceId).forEach(pods::add);
            	else
            		podrepository.findByNamespaceIdEquals(namespaceId, startDateTime, endDateTime).forEach(pods::add);

            /*if (pods.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }*/

            return new ResponseEntity<>(new ResponseEnvelope<List<Pod> >(200, "success.", pods), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/pods")
    public ResponseEntity<ResponseEnvelope<List<Pod> >> postAllPods(
    		@RequestParam(required = false) Long namespaceId,
    		@RequestParam(value = "start", required = false) Long start,
			@RequestParam(value = "limit", required = false) Long limit,
			@RequestParam(value = "startDateTime", required = false) String startDateTime,
			@RequestParam(value = "endDateTime", required = false) String endDateTime) {
        try {
        	List<Pod> pods = new ArrayList<Pod>();
            if (namespaceId == null) {
            	if (startDateTime == null & startDateTime == null)
            		podrepository.findAll().forEach(pods::add);
            	else
            		podrepository.findAll(startDateTime, endDateTime).forEach(pods::add);
            }
            else
            	if (startDateTime == null & startDateTime == null)
            		podrepository.findByNamespaceIdEquals(namespaceId).forEach(pods::add);
            	else
            		podrepository.findByNamespaceIdEquals(namespaceId, startDateTime, endDateTime).forEach(pods::add);

            if (pods.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(new ResponseEnvelope<List<Pod> >(200, "success.", pods), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/pod/{id}")
    public ResponseEntity<Pod> getPodById(@PathVariable("id") long id) {
        Optional<Pod> PodData = podrepository.findById(id);

        if (PodData.isPresent()) {
            return new ResponseEntity<>(PodData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}