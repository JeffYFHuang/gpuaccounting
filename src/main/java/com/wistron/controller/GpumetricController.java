package com.wistron.controller;

import com.wistron.model.Gpumetric;
import com.wistron.repository.GPURepository;
import com.wistron.repository.GpumetricRepository;
import com.wistron.repository.PodRepository;

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

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Arrays;

//@CrossOrigin(origins = "http://localhost:8081")
@RestController
//@RequestMapping("/api")
public class GpumetricController {
	private static final Logger log = LoggerFactory.getLogger(GpumetricController.class);

    @Autowired
    GpumetricRepository gpumetricRepository;

 /*   @GetMapping("/gpumetrics")
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
*/
    @GetMapping("/gpumetric/{id}")
    public ResponseEntity<Gpumetric> getGPUMetricById(@PathVariable("id") long id) {
        Optional<Gpumetric> GpumetricData = gpumetricRepository.findById(id);

        if (GpumetricData.isPresent()) {
            return new ResponseEntity<>(GpumetricData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    public static Long[] strArrayToLongArray(String[] a){
        Long[] b = new Long[a.length];
        for (int i = 0; i < a.length; i++) {
            b[i] = Long.parseLong(a[i]);
        }

        return b;
    }

    @GetMapping("/gpumetrics/{ids}")
    public ResponseEntity<List<Gpumetric>> getContainerGPUMetricById(@PathVariable(value = "ids", required = false) List<Long> ids,
													    	   @RequestParam(value = "startDateTime", required = false) String startDateTime,
															   @RequestParam(value = "endDateTime", required = false) String endDateTime) {
    	log.info("query gpu metrics gpus:{}, statTIme:{}, endTime:{}", ids, startDateTime, endDateTime);
    	try {
            List<Gpumetric> gpumetrics = new ArrayList<Gpumetric>();
            if (ids == null)
            	return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            else {
            	gpumetricRepository.findGpumetricsByGpuIdIn(ids, startDateTime, endDateTime).forEach(gpumetrics::add);
            	//gpumetricRepository.findGpumetricByGpuId(ids.get(0)).forEach(gpumetrics::add);
            	log.info("gpumetrics {}", gpumetrics.size());
            }

            if (gpumetrics.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(gpumetrics, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }    
}