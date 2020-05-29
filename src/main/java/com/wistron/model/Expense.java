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
    	this.gpuMUsedHours = 0;
    	this.cpuUsedHours = 0;
    	this.memoryHours = 0;
    	this.memoryUsedHours = 0;
    }

    public void calExpense(Date ds, Date de, List<Namespaceusedresourcequota> resourcequotas) throws Exception {
    	Namespaceusedresourcequota rq;
    	Date startTime;
    	Date endTime;

    	for (int i = 0; i < resourcequotas.size(); i++) {
    		rq = resourcequotas.get(i);
    		startTime = new SimpleDateFormat("MM/dd/yyyyHH:mm:ss").parse(rq.getStartTime());
    		endTime = new SimpleDateFormat("MM/dd/yyyyHH:mm:ss").parse(rq.getQueryTime());
    		//log.info("The resource start time is {}, end time is {}", startTime, endTime);
    		startTime = startTime.before(ds) ? ds : startTime;
    		endTime = endTime.after(de) ? de : endTime;
    		
    	    long diffInMillies = Math.abs(endTime.getTime() - startTime.getTime());
    	    float hours = (float) ((float)diffInMillies/3600000.0);
    	    //log.info("The resource located duration is {} hours by namespace id {}.", hours, rq.getNamespaceId());
    	    this.gpuHours += hours * rq.getRequestsNvidiaComGpu();
    	    this.cpuHours += hours * Float.parseFloat(rq.getRequestsCpu().replaceAll("[^\\.0123456789]",""));
    	    this.memoryHours += hours * Float.parseFloat(rq.getRequestsMemory().replaceAll("[^\\.0123456789]",""));
    	}
    	this.cpuHours = (float) (this.cpuHours / 1000.0);
    	this.memoryHours = (float) (this.memoryHours / 1024.0);
    	this.lastupdated = new Date();
    	//log.info(this.toString());
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
        return cpuHours;
    }

    public float getGpuUsedHours() {
        return gpuUsedHours;
    }

    public void setUsedGpuHours(float gpuUsedHours) {
        this.gpuUsedHours = gpuUsedHours;
    }

    public float getGpuMUsedHours() {
        return gpuMUsedHours;
    }

    public void setUsedGpuMHours(float gpuMUsedHours) {
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