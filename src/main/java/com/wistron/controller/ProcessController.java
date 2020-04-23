package com.wistron.controller;

import com.wistron.model.Process;
import com.wistron.repository.ProcessRepository;
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
public class ProcessController {

    @Autowired
    ProcessRepository processRepository;

    @GetMapping("/processes")
    public ResponseEntity<ResponseEnvelope<List<Process> >> getAllProcesses(
    		@RequestParam(required = false) Long containerId,
    		@RequestParam(value = "start", required = false) Long start,
			@RequestParam(value = "limit", required = false) Long limit,
			@RequestParam(value = "startDateTime", required = false) String startDateTime,
			@RequestParam(value = "endDateTime", required = false) String endDateTime) {
        try {
            List<Process> processes = new ArrayList<Process>();
            if (containerId == null) {
            	if (startDateTime == null & startDateTime == null)
            		processRepository.findAll().forEach(processes::add);
            	else
            		processRepository.findAll(startDateTime, endDateTime).forEach(processes::add);
            }
            else
            	if (startDateTime == null & startDateTime == null)
            		processRepository.findProcessesByContainerId(containerId).forEach(processes::add);
            	else
            		processRepository.findProcessesByContainerId(containerId, startDateTime, endDateTime).forEach(processes::add);

            /*if (processes.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }*/

            return new ResponseEntity<>(new ResponseEnvelope<List<Process> >(200, "success.", processes), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/processes")
    public ResponseEntity<ResponseEnvelope<List<Process> >> postAllProcesses(
    		@RequestParam(required = false) Long containerId,
    		@RequestParam(value = "start", required = false) Long start,
			@RequestParam(value = "limit", required = false) Long limit,
			@RequestParam(value = "startDateTime", required = false) String startDateTime,
			@RequestParam(value = "endDateTime", required = false) String endDateTime) {
        try {
            List<Process> processes = new ArrayList<Process>();
            if (containerId == null) {
            	if (startDateTime == null & startDateTime == null)
            		processRepository.findAll().forEach(processes::add);
            	else
            		processRepository.findAll(startDateTime, endDateTime).forEach(processes::add);
            }
            else
            	if (startDateTime == null & startDateTime == null)
            		processRepository.findProcessesByContainerId(containerId).forEach(processes::add);
            	else
            		processRepository.findProcessesByContainerId(containerId, startDateTime, endDateTime).forEach(processes::add);

            /*if (processes.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }*/

            return new ResponseEntity<>(new ResponseEnvelope<List<Process> >(200, "success.", processes), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/process/{id}")
    public ResponseEntity<Process> getProcessById(@PathVariable("id") long id) {
        Optional<Process> processData = processRepository.findById(id);

        if (processData.isPresent()) {
            return new ResponseEntity<>(processData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}