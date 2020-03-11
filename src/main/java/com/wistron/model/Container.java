package com.wistron.model;

import javax.persistence.*;

/*cmd = 'CREATE TABLE IF NOT EXISTS containers (' \
        '`id` INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,' \
        '`pod_id` INT(10) NOT NULL,' \
        '`name` VARCHAR(32) NOT NULL,' \
        '`limits.cpu` VARCHAR(32),' \
        '`limits.memory` VARCHAR(32),' \
        '`limits.nvidia.com/gpu` VARCHAR(32),' \
        '`requests.cpu` VARCHAR(32),' \
        '`requests.memory` VARCHAR(32),' \
        '`requests.nvidia.com/gpu` VARCHAR(32),' \
        '`nspid` BIGINT(10) NOT NULL' \
        ')'*/

@Entity
@Table(name = "containers")
public class Container {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "int(11) NOT NULL AUTO_INCREMENT")
    private Long id;
    @Column(name = "pod_id", columnDefinition = "int(11) NOT NULL")
    private Long podId;
    @Column(name = "name", columnDefinition = "char(32) NOT NULL")
    private String name;
    @Column(name = "limits_cpu", columnDefinition = "int(4)")
    private Integer limitsCpu;
    @Column(name = "limits_memory", columnDefinition = "char(32)")
    private String limitsMemory;
    @Column(name = "limits_nvidia_com_gpu", columnDefinition = "int(4)")
    private Integer limitsNvidiaComGpu;
    @Column(name = "requests_cpu", columnDefinition = "int(4)")
    private Integer requestsCpu;
    @Column(name = "requests_memory", columnDefinition = "char(32)")
    private String requestsMemory;
    @Column(name = "requests_nvidia_com_gpu", columnDefinition = "int(4)")
    private Integer requestsNvidiaComGpu;
    @Column(name = "nspid", columnDefinition = "BIGINT(11) NOT NULL")
    private Long nspid;

    public Container() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getLimitsCpu() {
        return limitsCpu;
    }

    public void setLimitsCpu(Integer limits_cpu) {
        this.limitsCpu = limitsCpu;
    }

    public String getLimitsMemory() {
        return limitsMemory;
    }

    public void setLimitsMemory(String limits_memory) {
        this.limitsMemory = limitsMemory;
    }

    public Integer getLimitsNvidiaComGpu() {
        return limitsNvidiaComGpu;
    }

    public void setLimitsNvidiaComGpu(Integer limitsNvidiaComGpu) {
        this.limitsNvidiaComGpu = limitsNvidiaComGpu;
    }

    public Integer getRequestsCpu() {
        return requestsCpu;
    }

    public void setRequestsCpu(Integer requests_cpu) {
        this.requestsCpu = requestsCpu;
    }

    public String getRequestsMemory() {
        return requestsMemory;
    }

    public void setRequestsMemory(String requestsMemory) {
        this.requestsMemory = requestsMemory;
    }

    public Integer getRequestsNvidiaComGpu() {
        return requestsNvidiaComGpu;
    }

    public void setRequestsNvidiaComGpu(Integer requestsNvidiaComGpu) {
        this.requestsNvidiaComGpu = requestsNvidiaComGpu;
    }

    public Long getPodId() {
        return podId;
    }

    public void setPodId(Long podId) {
        this.podId = podId;
    }

    public Long getNspid() {
        return nspid;
    }

    public void setNspid(Long nspid) {
        this.nspid = nspid;
    }

    @Override
    public String toString() {
        return "Container{" +
                "id=" + id +
                ", podId=" + podId +
                ", name='" + name + '\'' +
                ", limitsCpu=" + limitsCpu +
                ", limitsMemory='" + limitsMemory + '\'' +
                ", limitsNvidiaComGpu=" + limitsNvidiaComGpu +
                ", requestsCpu=" + requestsCpu +
                ", requestsMemory='" + requestsMemory + '\'' +
                ", requestsNvidiaComGpu=" + requestsNvidiaComGpu +
                ", nspid=" + nspid +
                '}';
    }
}