package com.wistron.model;

import javax.persistence.*;

/*cmd = 'CREATE TABLE IF NOT EXISTS gpumetrics (' \
        '`id` INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,' \
        '`gpu_id` INT(10) NOT NULL,' \
        '`temperature.gpu` int(4),' \
        '`utilization.gpu` int(4),' \
        '`power.draw` INT(4),' \
        '`memory.used` INT(4),' \
        '`query_time` VARCHAR(32) NOT NULL' \
        ')'*/

@Entity
@Table(name = "gpumetrics")
public class Gpumetric {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "int(11) NOT NULL AUTO_INCREMENT")
    private Long id;
    @Column(name = "gpu_id", columnDefinition = "int(11) NOT NULL")
    private Long gpuId;
    @Column(name = "temperature_gpu", columnDefinition = "int(4)")
    private Integer temperatureGpu;
    @Column(name = "utilization_gpu", columnDefinition = "int(4)")
    private Integer utilizationGpu;
    @Column(name = "power_draw", columnDefinition = "int(4)")
    private Integer powerDraw;
    @Column(name = "memory_used", columnDefinition = "int(4)")
    private Integer memoryUsed;
    @Column(name = "query_time", columnDefinition = "char(32) NOT NULL")
    private String queryTime;

    public Gpumetric() {
    }

    @Override
    public String toString() {
        return "Gpumetric{" +
                "id=" + id +
                ", gpuId=" + gpuId +
                ", temperatureGpu=" + temperatureGpu +
                ", utilizationGpu=" + utilizationGpu +
                ", powerDraw=" + powerDraw +
                ", memoryUsed=" + memoryUsed +
                ", queryTime=" + queryTime +
                '}';
    }

    public Integer getMemoryUsed() {
        return memoryUsed;
    }

    public void setMemoryUsed(Integer memoryUsed) {
        this.memoryUsed = memoryUsed;
    }

    public Integer getPowerDraw() {
        return powerDraw;
    }

    public void setPowerDraw(Integer powerDraw) {
        this.powerDraw = powerDraw;
    }

    public Long getGpuId() {
        return gpuId;
    }

    public void setGpuId(Long gpuId) {
        this.gpuId = gpuId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getUtilizationGpu() {
        return utilizationGpu;
    }

    public void setUtilizationGpu(Integer utilizationGpu) {
        this.utilizationGpu = utilizationGpu;
    }

    public Integer getTemperatureGpu() {
        return temperatureGpu;
    }

    public void setTemperatureGpu(Integer temperatureGpu) {
        this.temperatureGpu = temperatureGpu;
    }

    public void setQueryTime(String queryTime) {
        this.queryTime = queryTime;
    }

    public String getQueryTime() {
        return queryTime;
    }
}