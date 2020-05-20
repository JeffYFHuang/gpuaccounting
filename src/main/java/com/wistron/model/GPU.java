package com.wistron.model;

import javax.persistence.*;

/*cmd = 'CREATE TABLE IF NOT EXISTS gpus (' \
        '`id` INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,' \
        '`uuid` VARCHAR(64) NOT NULL,' \
        '`name` VARCHAR(32) NOT NULL,' \
        '`enforced.power.limit` INT(4),' \
        '`memory.total` INT(4),' \
        '`hostname` VARCHAR(32) NOT NULL' \
        ')'
*/

@Entity
@Table(name = "gpus")
public class GPU {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", columnDefinition = "int(11) NOT NULL AUTO_INCREMENT")
    private Long id;
    @Column(name = "uuid", columnDefinition = "char(64) NOT NULL")
    private String uuid;
    @Column(name = "name", columnDefinition = "char(32) NOT NULL")
    private String name;
    @Column(name = "enforced_power_limit", columnDefinition = "int(4)")
    private Integer enforcedpowerlimit;
    @Column(name = "memory_total", columnDefinition = "int(4)")
    private Integer memorytotal;
    @Column(name = "hostname", columnDefinition = "char(32) NOT NULL")
    private String hostname;
    @Column(name = "used", columnDefinition = "int(1)")
    private Integer used;
    @Column(name = "user", columnDefinition = "int(11)")
    private Integer user; //may be namespace_id TBD.

    public GPU() {

    }

    public GPU(String uuid, String name, String hostname) {
        this.uuid = uuid;
        this.name = name;
        this.hostname = hostname;
    }

    @Override
    public String toString() {
        return String.format("Gpu[id=%d, uuid=%s, name='%s', enforced.power.limit=%d, memory.limit=%d, hostname='%s']", id,
                id, uuid, name, enforcedpowerlimit, memorytotal, hostname);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUuid() {
        return this.uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getEnforcedpowerlimit() {
        return this.enforcedpowerlimit;
    }

    public void setEnforcedpowerlimit(Integer enforcedpowerlimit) {
        this.enforcedpowerlimit = enforcedpowerlimit;
    }

    public Integer getMemorytotal() {
        return this.memorytotal;
    }

    public void setMemorytotal(Integer memorytotal) {
        this.memorytotal = memorytotal;
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }
    
    public Integer getUsed() {
        return used;
    }

    public void setUsed(Integer used) {
        this.used = used;
    }
    
    public Integer getUser() {
        return user;
    }

    public void setHostname(Integer user) {
        this.user = user;
    }
}
