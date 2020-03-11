package com.wistron.model;

import javax.persistence.*;

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
    @Column(name = "query_time", columnDefinition = "char(32) NOT NULL")
    private String queryTime;

    public Namespaceusedresourcequota() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLimitsCpu() {
        return limitsCpu;
    }

    public void setLimitsCpu(String limitsCpu) {
        this.limitsCpu = limitsCpu;
    }

    public void setLimitsMemory(String limitsMemory) {
        this.limitsMemory = limitsMemory;
    }

    public String getLimitsMemory() {
        return limitsMemory;
    }

    public void setLimitsNvidiaComGpu(Integer limitsNvidiaComGpu) {
        this.limitsNvidiaComGpu = limitsNvidiaComGpu;
    }

    public Integer getLimitsNvidiaComGpu() {
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
        return requestsCpu;
    }

    public void setRequestsMemory(String requestsMemory) {
        this.requestsMemory = requestsMemory;
    }

    public String getRequestsMemory() {
        return requestsMemory;
    }

    public void setRequestsNvidiaComGpu(Integer requestsNvidiaComGpu) {
        this.requestsNvidiaComGpu = requestsNvidiaComGpu;
    }

    public Integer getRequestsNvidiaComGpu() {
        return requestsNvidiaComGpu;
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
                ", queryTime=" + queryTime +
                '}';
    }
}