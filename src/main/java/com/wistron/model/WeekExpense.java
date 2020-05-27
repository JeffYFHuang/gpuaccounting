package com.wistron.model;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.persistence.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Entity
@Table(name = "weekexpenses")
public class WeekExpense {
	private static final Logger log = LoggerFactory.getLogger(WeekExpense.class);
    @EmbeddedId
    private WeekExpenseId weekExpenseId;

    @Column(name = "gpu_hours", columnDefinition = "float(4)")
    private float gpuHours;
    @Column(name = "cpu_hours", columnDefinition = "float(4)")
    private float cpuHours;
    @Column(name = "memory_hours", columnDefinition = "float(4)")
    private float memoryHours;
    @Column(name = "type", columnDefinition = "int(2)")
    private Integer type;

    public WeekExpense() {
    }

    public WeekExpense(WeekExpenseId weekExpenseId) {
    	this.weekExpenseId = weekExpenseId;
    }

    public void calWeekExpense(Date ds, Date de, List<Namespaceusedresourcequota> resourcequotas) throws Exception {
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

    public void setMemoryHours(float memoryHours) {
        this.memoryHours = memoryHours;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "WeekExpense{" +
                "namespaceId=" + weekExpenseId.getNamespaceId() +
                ", gpuHours=" + this.gpuHours +
                ", cpuHours=" + this.cpuHours +
                ", memoryHours=" + this.memoryHours +
                ", year=" + weekExpenseId.getYear() +
                ", month=" + weekExpenseId.getMonth() +
                ", week=" + weekExpenseId.getWeek() +
                '}';
    }
}