package com.wistron.model;

import java.text.SimpleDateFormat;

import javax.persistence.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jdk.internal.org.jline.utils.Log;

/*cmd = 'CREATE TABLE IF NOT EXISTS namespaceusedresourcequotas (' \
        '`id` INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,' \
        '`namespace_id` INT(10) NOT NULL,' \
        '`limits.cpu` INT(4),' \
        '`limits.memory` VARCHAR(32),' \
        '`limits.nvidia.com/gpu` INT(4),' \
        '`requests.cpu` VARCHAR(32),' \
        '`requests.memory` VARCHAR(32),' \
        '`requests.nvidia.com/gpu` INT(4),' \
        '`query_time` VARCHAR(32) NOT NULL' \
        ')' */

@Entity
@Table(name = "namespaceusedresourcequotas")
public class Namespaceusedresourcequota {
	private static final Logger log = LoggerFactory.getLogger(Namespaceusedresourcequota.class);

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "int(11) NOT NULL AUTO_INCREMENT")
    private Long id;
    @Column(name = "namespace_id", columnDefinition = "int(11) NOT NULL")
    private Long namespaceId;
    @Column(name = "limits_cpu", columnDefinition = "char(16)")
    private String limitsCpu;
    @Column(name = "limits_memory", columnDefinition = "char(32)")
    private String limitsMemory;
    @Column(name = "limits_nvidia_com_gpu", columnDefinition = "int(4)")
    private Integer limitsNvidiaComGpu;
    @Column(name = "requests_cpu", columnDefinition = "char(16)")
    private String requestsCpu;
    @Column(name = "requests_memory", columnDefinition = "char(32)")
    private String requestsMemory;
    @Column(name = "requests_nvidia_com_gpu", columnDefinition = "int(4)")
    private Integer requestsNvidiaComGpu;
    @Column(name = "start_time", columnDefinition = "char(32)")
    private String startTime;
    @Column(name = "query_time", columnDefinition = "char(32) NOT NULL")
    private String queryTime;


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

    public Namespaceusedresourcequota() {
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }

        if (!Namespaceusedresourcequota.class.isAssignableFrom(obj.getClass())) {
            return false;
        }

        Namespaceusedresourcequota other = (Namespaceusedresourcequota)obj;
/*
       log.info("{} {} {}", other.getNamespaceId(), namespaceId, other.getNamespaceId() == namespaceId);
 	   log.info("{} {} {}", other.getLimitsCpu(), getLimitsCpu(), parseCpuHz(other.getLimitsCpu()) == parseCpuHz( getLimitsCpu()));
 	   log.info("{} {} {}", other.getLimitsMemory(), getLimitsMemory(), parseMem(other.getLimitsMemory()) == parseMem(getLimitsMemory()));
 	   log.info("{} {} {}", other.getLimitsNvidiaComGpu(), getLimitsNvidiaComGpu(), other.getLimitsNvidiaComGpu() == getLimitsNvidiaComGpu());
 	   log.info("{} {} {}", other.getRequestsCpu(), getRequestsCpu(), parseCpuHz(other.getRequestsCpu()) == parseCpuHz(getRequestsCpu()));
 	   log.info("{} {} {}", other.getRequestsMemory(), getRequestsMemory(), parseMem(other.getRequestsMemory()) == parseMem(getRequestsMemory()));
 	   log.info("{} {} {}", other.getRequestsNvidiaComGpu(), getRequestsNvidiaComGpu(), other.getRequestsNvidiaComGpu() == getRequestsNvidiaComGpu());
*/        //Log.info("this {}", this.toString());
        return  other.getNamespaceId() == namespaceId &&
        	    parseCpuHz(other.getLimitsCpu()) == parseCpuHz( getLimitsCpu()) &&
  	   			parseMem(other.getLimitsMemory()) == parseMem(getLimitsMemory()) &&
  	   			other.getLimitsNvidiaComGpu() == getLimitsNvidiaComGpu() &&
				parseCpuHz(other.getRequestsCpu()) == parseCpuHz(getRequestsCpu()) &&
				parseMem(other.getRequestsMemory()) == parseMem(getRequestsMemory()) &&
				other.getRequestsNvidiaComGpu() == getRequestsNvidiaComGpu();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLimitsCpu() {
    	if (limitsCpu == null)
    		return "0";
        return limitsCpu;
    }

    public void setLimitsCpu(String limitsCpu) {
        this.limitsCpu = limitsCpu;
    }

    public void setLimitsMemory(String limitsMemory) {
        this.limitsMemory = limitsMemory;
    }

    public String getLimitsMemory() {
    	if (limitsMemory == null)
    		return "0";
        return limitsMemory;
    }

    public void setLimitsNvidiaComGpu(Integer limitsNvidiaComGpu) {
        this.limitsNvidiaComGpu = limitsNvidiaComGpu;
    }

    public Integer getLimitsNvidiaComGpu() {
    	if (limitsNvidiaComGpu == null)
    		return 0;
        return limitsNvidiaComGpu;
    }

    public void setNamespaceId(Long namespaceId) {
        this.namespaceId = namespaceId;
    }

    public Long getNamespaceId() {
        return namespaceId;
    }

    public void setRequestsCpu(String requestsCpu) {
        this.requestsCpu = requestsCpu;
    }

    public String getRequestsCpu() {
    	if (requestsCpu == null)
    		return "0";
        return requestsCpu;
    }

    public void setRequestsMemory(String requestsMemory) {
        this.requestsMemory = requestsMemory;
    }

    public String getRequestsMemory() {
    	if (requestsMemory == null)
    		return "0";
        return requestsMemory;
    }

    public void setRequestsNvidiaComGpu(Integer requestsNvidiaComGpu) {
        this.requestsNvidiaComGpu = requestsNvidiaComGpu;
    }

    public Integer getRequestsNvidiaComGpu() {
    	if (requestsNvidiaComGpu == null)
    		return 0;
        return requestsNvidiaComGpu;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public void setQueryTime(String queryTime) {
        this.queryTime = queryTime;
    }

    public String getQueryTime() {
        return queryTime;
    }

    @Override
    public String toString() {
        return "Namespaceusedresourcequota{" +
                "id=" + id +
                ", namespaceId=" + namespaceId +
                ", limitsCpu=" + limitsCpu +
                ", limitsMemory='" + limitsMemory + '\'' +
                ", limitsNvidiaComGpu=" + limitsNvidiaComGpu +
                ", requestsCpu=" + requestsCpu +
                ", requestsMemory='" + requestsMemory + '\'' +
                ", requestsNvidiaComGpu=" + requestsNvidiaComGpu +
                ", startTime=" + startTime +
                ", queryTime=" + queryTime +
                '}';
    }
}