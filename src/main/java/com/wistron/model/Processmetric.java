package com.wistron.model;

import javax.persistence.*;

import org.springframework.transaction.annotation.Transactional;

/*cmd = 'CREATE TABLE IF NOT EXISTS processmetrics (' \
        '`id` INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,' \
        '`process_id` INT(10) NOT NULL,' \
        '`gpumetric_id` INT(10) NOT NULL,' \
        '`gpu_memory_usage` INT(4),' \
        '`cpu_percent` FLOAT(4),' \
        '`cpu_memory_usage` BIGINT(10),' \
        '`query_time` VARCHAR(32) NOT NULL' \
        ')'*/

@Entity
@Table(name = "processmetrics")
public class Processmetric implements Comparable< Processmetric >{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "int(11) NOT NULL AUTO_INCREMENT")
    private Long id;
    @Column(name = "process_id", columnDefinition = "int(11) NOT NULL")
    private Long processId;
    @Column(name = "gpumetric_id", columnDefinition = "int(11) NOT NULL")
    private Long gpumetricId;
    @Column(name = "gpu_memory_usage", columnDefinition = "int(4)")
    private Integer gpuMemoryUsage;
    @Column(name = "cpu_percent", columnDefinition = "float(4)")
    private Float cpuPercent;
    @Column(name = "cpu_memory_usage", columnDefinition = "bigint(11)")
    private Long cpuMemoryUsage;
    @Column(name = "query_time", columnDefinition = "char(32) NOT NULL")
    private String queryTime;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gpumetric_id", referencedColumnName = "id", insertable = false, updatable = false)    
    private Gpumetric gpumetric;

    @Transactional
    public Gpumetric getGpumetric() {
        return gpumetric;
    }

    public void setGpumetric(Gpumetric gpumetric) {
        this.gpumetric = gpumetric;
    }
    
    public Processmetric() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getCpuPercent() {
        return cpuPercent;
    }

    public void setCpuPercent(Float cpuPercent) {
        this.cpuPercent = cpuPercent;
    }

    public Long getCpuMemoryUsage() {
        return cpuMemoryUsage;
    }

    public void setCpuMemoryUsage(Long cpuMemoryUsage) {
        this.cpuMemoryUsage = cpuMemoryUsage;
    }

    public Integer getGpuMemoryUsage() {
        return gpuMemoryUsage;
    }

    public void setGpuMemoryUsage(Integer gpuMemoryUsage) {
        this.gpuMemoryUsage = gpuMemoryUsage;
    }

    public Long getGpumetricId() {
        return gpumetricId;
    }

    public void setGpumetricId(Long gpumetricId) {
        this.gpumetricId = gpumetricId;
    }

    public Long getProcessId() {
        // This is present the id for process table, not the system process id.
        return processId;
    }

    public void setProcessId(Long processId) {
        this.processId = processId;
    }

    public String getQueryTime() {
        return queryTime;
    }

    public void setQueryTime(String queryTime) {
        this.queryTime = queryTime;
    }

	@Override
	public int compareTo(Processmetric o) {
		return this.getId().compareTo(o.getId());
	}
}