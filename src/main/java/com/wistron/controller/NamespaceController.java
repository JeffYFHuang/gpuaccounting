package com.wistron.controller;

import com.wistron.model.GPU;
import com.wistron.model.Namespace;
import com.wistron.repository.NamespaceRepository;
import com.wistron.tasks.ExpenseTask;
import com.wistron.utils.ResponseEnvelope;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

//@CrossOrigin(origins = "http://localhost:8081")
@RestController
//@RequestMapping("/api")
public class NamespaceController {
	private static final Logger log = LoggerFactory.getLogger(NamespaceController.class);

    @Autowired
    NamespaceRepository namespaceRepository;

    @GetMapping("/namespaces")
    public ResponseEntity<ResponseEnvelope<List<Namespace> >> getAllNamespaces(@RequestParam(required = false) String email) {
        try {
            List<Namespace> namespaces = new ArrayList<Namespace>();
            if (email == null)
                namespaceRepository.findAll().forEach(namespaces::add);
            else
                namespaceRepository.findNamespaceByOwner(email).forEach(namespaces::add);

            if (namespaces.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(new ResponseEnvelope<List<Namespace> >(200, "success.", namespaces), HttpStatus.OK);
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
    
    @PostMapping("/namespace/setUserQuota") 
    public ResponseEntity<String> setUserQuota(
    		@RequestParam(required = false) Long id,
    		@RequestParam(value = "name", required = true) String namespace,
    		@RequestParam(value = "requests.cpu", required = true) String requests_cpu,
			@RequestParam(value = "requests.memory", required = true) String requests_memory,
			@RequestParam(value = "requests.gpu", required = true) Integer requests_nvidia_com_gpu,
    		@RequestParam(value = "limits.cpu", required = true) String limits_cpu,
			@RequestParam(value = "limits.memory", required = true) String limits_memory,
			@RequestParam(value = "limits.gpu", required = true) Integer limits_nvidia_com_gpu) {

    	log.info("requests.cpu: {}", requests_cpu);
    	//if kubectl apply * is successful then update the quota of the user in the namespace table else do nothing.  
/*	    if (NamespaceData.isPresent()) {
	            return new ResponseEntity<>(NamespaceData.get(), HttpStatus.OK);
	    } else {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }*/
    	return new ResponseEntity<>(new String("success"), HttpStatus.OK);
    }
}