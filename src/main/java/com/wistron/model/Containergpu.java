package com.wistron.model;

import javax.persistence.*;

/*cmd = 'CREATE TABLE IF NOT EXISTS containergpus (' \
        '`id` INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,' \
        '`pod_id` INT(10) NOT NULL,' \
        '`container_id` INT(10) NOT NULL,' \
        '`nspid` BIGINT(10) NOT NULL,' \
        '`gpu_id` INT(10) NOT NULL' \
        ')'*/

@Entity
@Table(name = "containergpus")
public class Containergpu {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "int(11) NOT NULL AUTO_INCREMENT")
    private Long id;
    @Column(name = "pod_id", columnDefinition = "int(11) NOT NULL")
    private Long podId;
    @Column(name = "container_id", columnDefinition = "int(11) NOT NULL")
    private Long containerId;
    @Column(name = "nspid", columnDefinition = "BIGINT(11) NOT NULL")
    private Long nspid;
    @Column(name = "gpu_id", columnDefinition = "int(11) NOT NULL")
    private Long gpuId;

    public Containergpu() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPodId() {
        return this.podId;
    }

    public void setPodId(Long podId) {
        this.podId = podId;
    }

    public Long getContainerId() {
        return containerId;
    }

    public void setContainerId(Long containerId) {
        this.containerId = containerId;
    }

    public Long getNspid() {
        return nspid;
    }

    public void setNspid(Long nspid) {
        this.nspid = nspid;
    }

    public Long getGpuId() {
        return gpuId;
    }

    public void setGpuId(Long gpuId) {
        this.gpuId = gpuId;
    }

    @Override
    public String toString() {
        return "Containergpu{" +
                "id=" + id +
                ", podid=" + podId +
                ", containerid=" + containerId +
                ", nspid=" + nspid +
                ", gpuid=" + gpuId +
                '}';
    }
}