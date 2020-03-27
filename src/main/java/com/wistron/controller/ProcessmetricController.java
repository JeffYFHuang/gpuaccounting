package com.wistron.controller;

import com.wistron.model.Process;
import com.wistron.model.Processmetric;
import com.wistron.repository.GPURepository;
import com.wistron.repository.GpumetricRepository;
import com.wistron.repository.ProcessmetricRepository;
import com.wistron.utils.ResponseEnvelope;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
public class ProcessmetricController {

    @Autowired
    ProcessmetricRepository processmetricRepository;

    @GetMapping("/processmetrics_42")
    public ResponseEntity<Page<Processmetric>> getAllProcessMetrics_42(
    		@RequestParam(value = "page", required = false) Long page,
			@RequestParam(value = "start", required = false) Long start,
			@RequestParam(value = "limit", required = false) Long limit,
			@RequestParam(value = "processId", required = false) Long processId,
			@RequestParam(value = "startDateTime", required = false) String startDateTime,
			@RequestParam(value = "endDateTime", required = false) String endDateTime) {
    	try {
            Pageable paging = PageRequest.of(start.intValue()/limit.intValue(), limit.intValue());
    		if (page != null)
    			paging = PageRequest.of(page.intValue() - 1, limit.intValue());
    		System.out.println(page.intValue() + startDateTime + endDateTime);
            Page<Processmetric> processmetrics = null;
            if (processId == null) {
            	if (startDateTime == null & startDateTime == null)
                	processmetrics = processmetricRepository.findAll(paging);
            	else
            		processmetrics = processmetricRepository.findAll(startDateTime, endDateTime, paging);
            }
            else
            	if (startDateTime == null & startDateTime == null)
            		processmetrics = processmetricRepository.findProcessesmetricByProcessId(processId, paging);
            	else
            		processmetrics = processmetricRepository.findProcessesmetricByProcessId(processId, startDateTime, endDateTime, paging);

            /*if (processmetrics.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }*/

            return new ResponseEntity<>(processmetrics, HttpStatus.OK); 
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/processmetrics_42")
    public ResponseEntity<Page<Processmetric>> postAllProcessMetrics_42(@RequestParam(value = "page", required = false) Long page,
    																					@RequestParam(value = "start", required = false) Long start,
    																					@RequestParam(value = "limit", required = false) Long limit,
    																					@RequestParam(value = "processId", required = false) Long processId,
    																					@RequestParam(value = "startDateTime", required = false) String startDateTime,
    																					@RequestParam(value = "endDateTime", required = false) String endDateTime) {
    	try {
            Pageable paging = PageRequest.of(start.intValue()/limit.intValue(), limit.intValue());
    		if (page != null)
    			paging = PageRequest.of(page.intValue() - 1, limit.intValue());
    		System.out.println(page.intValue());
            Page<Processmetric> processmetrics = null;
            if (processId == null) {
            	if (startDateTime == null & startDateTime == null)
                	processmetrics = processmetricRepository.findAll(paging);
            	else
            		processmetrics = processmetricRepository.findAll(startDateTime, endDateTime, paging);
            }
            else
            	if (startDateTime == null & startDateTime == null)
            		processmetrics = processmetricRepository.findProcessesmetricByProcessId(processId, paging);
            	else
            		processmetrics = processmetricRepository.findProcessesmetricByProcessId(processId, startDateTime, endDateTime, paging);

            /*if (processmetrics.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }*/

            return new ResponseEntity<>(processmetrics, HttpStatus.OK); 
            } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/processmetrics")
    public ResponseEntity<Page<Processmetric>> getAllProcessMetrics(
    		@RequestParam(value = "page", required = false) Long page,
			@RequestParam(value = "start", required = false) Long start,
			@RequestParam(value = "limit", required = false) Long limit,
			@RequestParam(value = "processId", required = false) Long processId,
			@RequestParam(value = "startDateTime", required = false) String startDateTime,
			@RequestParam(value = "endDateTime", required = false) String endDateTime) {
    	try {
            Pageable paging = PageRequest.of(0, 20);
            Page<Processmetric> processmetrics = null;
            if (processId == null) {
            	if (startDateTime == null & startDateTime == null)
                	processmetrics = processmetricRepository.findAll(paging);
            	else
            		processmetrics = processmetricRepository.findAll(startDateTime, endDateTime, paging);
            }
            else
            	if (startDateTime == null & startDateTime == null)
            		processmetrics = processmetricRepository.findProcessesmetricByProcessId(processId, paging);
            	else
            		processmetrics = processmetricRepository.findProcessesmetricByProcessId(processId, startDateTime, endDateTime, paging);

            /*if (processmetrics.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }*/

            return new ResponseEntity<>(processmetrics, HttpStatus.OK); 
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/processmetrics")
    public ResponseEntity<Page<Processmetric>> postAllProcessMetrics(
    		@RequestParam(value = "page", required = false) Long page,
			@RequestParam(value = "start", required = false) Long start,
			@RequestParam(value = "limit", required = false) Long limit,
			@RequestParam(value = "processId", required = false) Long processId,
			@RequestParam(value = "startDateTime", required = false) String startDateTime,
			@RequestParam(value = "endDateTime", required = false) String endDateTime) {
    	try {
            Pageable paging = PageRequest.of(start.intValue()/limit.intValue(), limit.intValue());
            Page<Processmetric> processmetrics = null;
            if (processId == null) {
            	if (startDateTime == null & startDateTime == null)
                	processmetrics = processmetricRepository.findAll(paging);
            	else
            		processmetrics = processmetricRepository.findAll(startDateTime, endDateTime, paging);
            }
            else
            	if (startDateTime == null & startDateTime == null)
            		processmetrics = processmetricRepository.findProcessesmetricByProcessId(processId, paging);
            	else
            		processmetrics = processmetricRepository.findProcessesmetricByProcessId(processId, startDateTime, endDateTime, paging);

            /*if (processmetrics.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }*/

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