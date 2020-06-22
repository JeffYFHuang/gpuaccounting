package com.wistron.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.util.JSONPObject;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
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
    		@RequestBody(required=false) JsonNode requestBody
    		) {

    	log.info("requestBody: {}", requestBody);
    	//requestBody: {"id":6,"name":"jeffyfhuang","owner":"jeff_yf_huang@wistron.com","limitsCpu":8,"limitsMemory":"32Gi","limitsNvidiaComGpu":2,"requestsCpu":12,"requestsMemory":"32Gi","requestsNvidiaComGpu":2}

        Long id = requestBody.get("id").asLong();
        String name = requestBody.get("name").asText();
        Integer requestsCpu = requestBody.get("requestsCpu").asInt();
        String requestsMemory = requestBody.get("requestsMemory").asText();
        Integer requestsNvidiaComGpu = requestBody.get("requestsNvidiaComGpu").asInt();
        Integer limitsCpu = requestBody.get("limitsCpu").asInt();
        String limitsMemory = requestBody.get("limitsMemory").asText();
        Integer limitsNvidiaComGpu = requestBody.get("limitsNvidiaComGpu").asInt();

        String command = String.format("./set_resourcequota.sh %s %d %s %d %d %s %d", name, requestsCpu, requestsMemory, requestsNvidiaComGpu, limitsCpu, limitsMemory, limitsNvidiaComGpu);
    	log.info(command);

    	try {
    	    Process process = Runtime.getRuntime().exec(command);
    	 
    	    BufferedReader reader = new BufferedReader(
    	            new InputStreamReader(process.getInputStream()));
    	    String line;
    	    String resp = "unchanged";
    	    while ((line = reader.readLine()) != null) {
    	        System.out.println(line);
    	    	if(line.indexOf("configured") != -1) {
    	            Namespace ns = new Namespace(id, name, requestsCpu, requestsMemory, requestsNvidiaComGpu, limitsCpu, limitsMemory, limitsNvidiaComGpu);
    	    		namespaceRepository.save(ns);
    	    		resp = "changed";
    	    		break;
    	    	}
    	    }
    	 
    	    reader.close();
    	    return new ResponseEntity<>(new String(resp), HttpStatus.OK);
    	 
    	} catch (IOException e) {
    	    e.printStackTrace();
    	    return new ResponseEntity<>(new String("fail"), HttpStatus.OK);
    	}
    }
}