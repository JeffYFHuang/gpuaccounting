package com.wistron.model;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.persistence.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.wistron.tasks.ExpenseTask;

@Entity
@Table(name = "expenses")
public class Expense {
	private static final Logger log = LoggerFactory.getLogger(Expense.class);
    @EmbeddedId
    private ExpenseId expenseId;

    @Column(name = "gpu_hours", columnDefinition = "float(4) default 0")
    private float gpuHours;
    @Column(name = "cpu_hours", columnDefinition = "float(4) default 0")
    private float cpuHours;
    @Column(name = "memory_hours", columnDefinition = "float(4) default 0")
    private float memoryHours;
    @Column(name = "gpu_used_hours", columnDefinition = "float(4) default 0")
    private float gpuUsedHours;
    @Column(name = "gpu_m_used_hours", columnDefinition = "float(4) default 0") //gpu memory used
    private float gpuMUsedHours;
    @Column(name = "cpu_used_hours", columnDefinition = "float(4) default 0")
    private float cpuUsedHours;
    @Column(name = "memory_used_hours", columnDefinition = "float(4) default 0")
    private float memoryUsedHours;
    @Column(name = "type", columnDefinition = "int(2) default 0")
    private Integer type;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "lastupdated", nullable = false)
    private Date lastupdated;

    public Expense() {
    	this.cpuHours = 0;
    	this.cpuUsedHours = 0;
    	this.gpuHours = 0;
    	this.gpuUsedHours = 0;
    	this.gpuMUsedHours = 0;
    	this.cpuUsedHours = 0;
    	this.memoryHours = 0;
    	this.memoryUsedHours = 0;
    }

    public Expense(ExpenseId expenseId) {
    	this.expenseId = expenseId;
    	this.cpuHours = 0;
    	this.cpuUsedHours = 0;
    	this.gpuHours = 0;
    	this.gpuUsedHours = 0;
    	this.gpuMUsedHours = 0;
    	this.cpuUsedHours = 0;
    	this.memoryHours = 0;
    	this.memoryUsedHours = 0;
    }

    public static double parseCpuHz(String cpu) {
    	float rtn = 0;
    	if (cpu.contains("m")) {
    		rtn = Float.parseFloat(cpu.replaceAll("[^\\.0123456789]",""));
    		return rtn/1024.0;
    	}
    	
    	return Float.parseFloat(cpu.replaceAll("[^\\.0123456789]",""));
    }
    
    public static double parseMem(String mem) {
    	if (mem.contains("Mi"))
    		return Float.parseFloat(mem.replaceAll("[^\\.0123456789]","")) / 1024.0;
    	if (mem.contains("Gi"))
    		return Float.parseFloat(mem.replaceAll("[^\\.0123456789]",""));
    	
    	return Float.parseFloat(mem.replaceAll("[^\\.0123456789]",""));
    }

    public void calExpense(Date ds, Date de, List<Pod> pods) throws Exception {
    	Date startTime;
    	Date endTime;
    	
		for (int j = 0; j < pods.size(); j++) {
			Pod pod = pods.get(j);
			try {
				//log.info("pod queryTime: {}", pod.getQueryTime());
				Date queryTime = new SimpleDateFormat("MM/dd/yyyyHH:mm:ss").parse(pod.getQueryTime());
    			if (queryTime.after(ds) && queryTime.before(de)) {
    	    		startTime = new SimpleDateFormat("MM/dd/yyyyHH:mm:ss").parse(pod.getStartTime());
    	    		endTime = new SimpleDateFormat("MM/dd/yyyyHH:mm:ss").parse(pod.getQueryTime());
    				///log.info("container size: {}", containers.size());
    	    		startTime = startTime.before(ds) ? ds : startTime;
    	    		endTime = endTime.after(de) ? de : endTime;

    	    	    long diffInMillies = Math.abs(endTime.getTime() - startTime.getTime());
    	    	    float hours = (float) ((float)diffInMillies/3600000.0);
    	    	    
    				List<Container> containers = pod.getContainers();
    				for (int k = 0; k < containers.size(); k++) {
    					Container container = containers.get(k);
    					//log.info(container.toString());

    		    	    if (container.getRequestsNvidiaComGpu() != null)
    		    	    {
    		    	    	this.gpuHours += hours * container.getRequestsNvidiaComGpu();
    		    	    }
    		    	    if (container.getRequestsCpu() != null) {
    		    	    	this.cpuHours += hours * parseCpuHz(container.getRequestsCpu());
    		    	    }
    		    	    if (container.getRequestsMemory() != null) {
    		    	    	this.memoryHours += hours * parseMem(container.getRequestsMemory());
    		    	    }
    		    	    //log.info("{} {} {} {}", k, this.gpuHours, this.cpuHours, this.memoryHours);
    				}
    			}
			} catch (Exception e){
				log.info(e.toString());
				break;
			}
		}

    	this.cpuHours = (float) (this.cpuHours);
    	this.memoryHours = (float) (this.memoryHours);
    	this.lastupdated = new Date();
    	log.info(this.toString());
    }

    public static Namespaceusedresourcequota calCurrentResourceQuota(Date now, List<Pod> pods) throws Exception {
    	Namespaceusedresourcequota rq = new Namespaceusedresourcequota();
		float limitsCpu = 0;
		float limitsMemory = 0;
		float limitsNvidiaComGpu = 0;
		float requestsCpu = 0;
		float requestsMemory = 0;
		float requestsNvidiaComGpu = 0;

		for (int j = 0; j < pods.size(); j++) {
			Pod pod = pods.get(j);
			try {
				Date queryTime = new SimpleDateFormat("MM/dd/yyyyHH:mm:ss").parse(pod.getQueryTime());
    			if (queryTime.after(now)) {
    				List<Container> containers = pod.getContainers();
    				for (int k = 0; k < containers.size(); k++) {
    					Container container = containers.get(k);
    					log.info(container.toString());

    		    	    if (container.getLimitsNvidiaComGpu() != null)
    		    	    {
    		    	    	limitsNvidiaComGpu += container.getLimitsNvidiaComGpu();
    		    	    }
    		    	    if (container.getLimitsCpu() != null) {
    		    	    	limitsCpu += parseCpuHz(container.getLimitsCpu());
    		    	    }
    		    	    if (container.getLimitsMemory() != null) {
    		    	    	limitsMemory += parseMem(container.getLimitsMemory());
    		    	    }
    		    	    if (container.getRequestsNvidiaComGpu() != null)
    		    	    {
    		    	    	requestsNvidiaComGpu += container.getRequestsNvidiaComGpu();
    		    	    }
    		    	    if (container.getRequestsCpu() != null) {
    		    	    	requestsCpu += parseCpuHz(container.getRequestsCpu());
    		    	    }
    		    	    if (container.getRequestsMemory() != null) {
    		    	    	requestsMemory += parseMem(container.getRequestsMemory());
    		    	    }
    		    	    //log.info("{} {} {} {}", k, this.gpuHours, this.cpuHours, this.memoryHours);
    				}
    			}
			} catch (Exception e){
				log.info(e.toString());
				break;
			}
		}

		rq.setLimitsCpu(Float.toString(limitsCpu));
		rq.setLimitsMemory(Float.toString(limitsMemory));
		rq.setLimitsNvidiaComGpu((int)limitsNvidiaComGpu);
		rq.setRequestsCpu(Float.toString(requestsCpu));
		rq.setRequestsMemory(Float.toString(requestsMemory));
		rq.setRequestsNvidiaComGpu((int)requestsNvidiaComGpu);

    	return rq;
    }

    public ExpenseId getExpenseId() {
    	return expenseId;
    }

    public void setExpenseId(ExpenseId expenseId) {
    	this.expenseId = expenseId;
    }

    public float getGpuHours() {
        return gpuHours;
    }

    public void setGpuHours(float gpuHours) {
        this.gpuHours = gpuHours;
    }

    public float getCpuHours() {
        return cpuHours;
    }

    public void setCpuHours(float cpuHours) {
        this.cpuHours = cpuHours;
    }

    public void setMemoryHours(float memoryHours) {
        this.memoryHours = memoryHours;
    }

    public float getMemoryHours() {
        return memoryHours;
    }

    public float getGpuUsedHours() {
        return gpuUsedHours;
    }

    public void setGpuUsedHours(float gpuUsedHours) {
        this.gpuUsedHours = gpuUsedHours;
    }

    public float getGpuMUsedHours() {
        return gpuMUsedHours;
    }

    public void setGpuMUsedHours(float gpuMUsedHours) {
        this.gpuMUsedHours = gpuMUsedHours;
    }

    public float getCpuUsedHours() {
        return cpuUsedHours;
    }

    public void setCpuUsedHours(float cpuUsedHours) {
        this.cpuUsedHours = cpuUsedHours;
    }

    public float getMemoryUsedHours() {
        return memoryUsedHours;
    }

    public void setMemoryUsedHours(float memoryUsedHours) {
        this.memoryUsedHours = memoryUsedHours;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Date getLastupdated() {
        return lastupdated;
    }

    public void setLastupdated(Date lastupdated) {
        this.lastupdated = lastupdated;
    }

    @Override
    public String toString() {
        return "Expense{" +
                "namespaceId=" + expenseId.getNamespaceId() +
                ", gpuHours=" + this.gpuHours +
                ", cpuHours=" + this.cpuHours +
                ", memoryHours=" + this.memoryHours +
                ", year=" + expenseId.getYear() +
                ", month=" + expenseId.getMonth() +
                '}';
    }
}