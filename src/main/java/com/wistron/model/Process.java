package com.wistron.model;

import javax.persistence.*;

/*cmd = 'CREATE TABLE IF NOT EXISTS processes (' \
        '`id` INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,' \
        '`pid` INT(10) NOT NULL,' \
        '`nspid` BIGINT(10) NOT NULL,' \
        '`container_id` INT(10) NOT NULL,' \
        '`command` VARCHAR(32),' \
        '`full_command` VARCHAR(256),' \
        '`start_time` VARCHAR(32) NOT NULL' \
        ')'*/

@Entity
@Table(name = "processes")
public class Process {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "int(11) NOT NULL AUTO_INCREMENT")
    private Long id;
    @Column(name = "pid", columnDefinition = "int(11) NOT NULL")
    private Integer pid;
    @Column(name = "nspid", columnDefinition = "bigint(11) NOT NULL")
    private Long nspid;
    @Column(name = "container_id", columnDefinition = "int(11) NOT NULL")
    private Long containerId;
    @Column(name = "command", columnDefinition = "char(32)")
    private String command;
    @Column(name = "full_command", columnDefinition = "char(255)")
    private String fullCommand;
    @Column(name = "start_time", columnDefinition = "char(32) NOT NULL")
    private String startTime;
    @Column(name = "query_time", columnDefinition = "char(32)")
    private String queryTime;

    public Process() {
    }

    public Integer getPid() {
        return pid;
    }

    public void setPid(Integer pid) {
        this.pid = pid;
    }

    public Long getContainerId() {
        return containerId;
    }

    public void setContainerId(Long containerId) {
        this.containerId = containerId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNspid() {
        return nspid;
    }

    public void setNspid(Long nspid) {
        this.nspid = nspid;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public String getFullCommand() {
        return fullCommand;
    }

    public void setFullCommand(String fullCommand) {
        this.fullCommand = fullCommand;
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
        return "Process{" +
                "id=" + id +
                ", pid=" + pid +
                ", nspid=" + nspid +
                ", containerId=" + containerId +
                ", command='" + command + '\'' +
                ", fullCommand='" + fullCommand + '\'' +
                ", startTime='" + startTime + '\'' +
                '}';
    }
}