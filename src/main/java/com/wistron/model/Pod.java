package com.wistron.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

/*cmd = 'CREATE TABLE IF NOT EXISTS pods (' \
                                              '`id` INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,' \
                                              '`name` VARCHAR(32) NOT NULL,' \
                                              '`start_time` VARCHAR(32) NOT NULL,' \
                                              '`namespace_id` INT(10) NOT NULL,' \
                                              '`hostname` VARCHAR(32) NOT NULL,' \
                                              '`phase` VARCHAR(16)' \
                                              ')'*/

@Entity
@Table(name = "pods")
public class Pod {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "int(11) NOT NULL AUTO_INCREMENT")
    private Long id;
    @Column(name = "name", columnDefinition = "char(32) NOT NULL")
    private String name;
    @Column(name = "namespace_id", columnDefinition = "int(11) NOT NULL")
    private Long namespaceId;
    @Column(name = "hostname", columnDefinition = "char(32)")
    private String hostname;
    @Column(name = "phase", columnDefinition = "char(16)")
    private String phase;
    @Column(name = "start_time", columnDefinition = "char(32)")
    private String startTime;
    @Column(name = "query_time", columnDefinition = "char(32)")
    private String queryTime;

    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true
            )
    @JoinColumn(name="pod_id")//, referencedColumnName = "id", insertable = false, updatable = false)    
    private List<Container> containers = new ArrayList<>();

    public List<Container> getContainers() {
    	return containers;
    }
    
    public void setContainers (List<Container> containers) {
    	this.containers = containers;
    }

    @ManyToMany
        @JoinTable(
            name="containergpus",
            joinColumns = @JoinColumn(name="pod_id"),
            inverseJoinColumns = @JoinColumn( name="gpu_id")
        )

    private List<GPU> gpus = new ArrayList<>();

    public List<GPU> getGpus() {
    	return gpus;
    }
    
    public void setGpus(List<GPU> gpus) {
    	this.gpus = gpus;
    }

    public Pod() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNamespaceId() {
        return namespaceId;
    }

    public void setNamespaceId(Long namespaceId) {
        this.namespaceId = namespaceId;
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
        this.phase = phase;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getQueryTime() {
        return queryTime;
    }

    public void setQueryTime(String queryTime) {
        this.queryTime = queryTime;
    }

    @Override
    public String toString() {
        return "Pod{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", startTime='" + startTime + '\'' +
                ", namespaceId=" + namespaceId +
                ", hostname='" + hostname + '\'' +
                ", phase='" + phase + '\'' +
                '}';
    }
}