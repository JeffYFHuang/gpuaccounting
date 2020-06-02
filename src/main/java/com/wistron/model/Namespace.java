package com.wistron.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import com.wistron.tasks.ExpenseTask;

/*cmd = 'CREATE TABLE IF NOT EXISTS namespaces (' \
        '`id` INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,' \
        '`name` VARCHAR(32) NOT NULL,' \
        '`owner` VARCHAR(64),' \
        '`limits.cpu` INT(4),' \
        '`limits.memory` VARCHAR(32),' \
        '`limits.nvidia.com/gpu` INT(4),' \
        '`requests.cpu` INT(4),' \
        '`requests.memory` VARCHAR(32),' \
        '`requests.nvidia.com/gpu` INT(4)' \
        ')'*/

@Entity
@Table(name = "namespaces")
public class Namespace {
	private static final Logger log = LoggerFactory.getLogger(ExpenseTask.class);
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "int(11) NOT NULL AUTO_INCREMENT")
    private Long id;
    @Column(name = "name", columnDefinition = "char(32) NOT NULL")
    private String name;
    @Column(name = "owner", columnDefinition = "char(64)")
    private String owner;
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

    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
            )
    @JoinColumn(name="namespace_id")//, referencedColumnName = "id", insertable = false, updatable = false)    
    private List<Pod> pods = new ArrayList<>();

    @Transactional
    public List<Pod> getPods() {
    	return pods;
    }
    
    public void getPods(List<Pod> pods) {
    	this.pods = pods;
    }

    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true
            )
    @JoinColumn(name="namespace_id")//, referencedColumnName = "id", insertable = false, updatable = false)    
    private List<Namespaceusedresourcequota> namespaceusedresourcequotas = new ArrayList<>();

    public List<Namespaceusedresourcequota> getNamespaceusedresourcequotas() {
    	return namespaceusedresourcequotas;
    }
    
    public void setNamespaceusedresourcequotas (List<Namespaceusedresourcequota> Namespaceusedresourcequotas) {
    	this.namespaceusedresourcequotas = Namespaceusedresourcequotas;
    }
    
 /*   @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true
            )
    @JoinTable(
            name="gpus",
            joinColumns = @JoinColumn(name="user")
        )   
    private List<GPU> cgpus = new ArrayList<>(); // current used gpus

    public List<GPU> getCgpus() {
    	return cgpus;
    }
    
    public void setCgpus (List<GPU> cgpus) {
    	this.cgpus = cgpus;
    }*/

/*    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name="containergpus",
        joinColumns = @JoinColumn(name="namespace_id"),
        inverseJoinColumns = @JoinColumn( name="gpu_id")
    )

	private List<GPU> gpus = new ArrayList<>();

    @Transactional
	public List<GPU> getGpus() {
		return gpus;
	}
	
	public void setGpus(List<GPU> gpus) {
		this.gpus = gpus;
	}
*/
    public Namespace() {
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setLimitsCpu(Integer limitsCpu) {
        this.limitsCpu = limitsCpu;
    }

    public Integer getLimitsCpu() {
        return limitsCpu;
    }

    public void setLimitsMemory(String limitsMemory) {
        this.limitsMemory = limitsMemory;
    }

    public String getLimitsMemory() {
        return limitsMemory;
    }

    public void setRequestsMemory(String requestsMemory) {
        this.requestsMemory = requestsMemory;
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

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getOwner() {
        return owner;
    }

    public Integer getRequestsNvidiaComGpu() {
        return requestsNvidiaComGpu;
    }

    public void setRequestsCpu(Integer requestsCpu) {
        this.requestsCpu = requestsCpu;
    }

    public void setRequestsNvidiaComGpu(Integer requestsNvidiaComGpu) {
        this.requestsNvidiaComGpu = requestsNvidiaComGpu;
    }

    public String getRequestsMemory() {
        return requestsMemory;
    }
}