package com.wistron.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class WeekExpenseId implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "namespace_id")
    private Long namespaceId;

    @Column(name = "year")
    private Integer year;
    
    @Column(name = "month")
    private Integer month;

    @Column(name = "week")
    private Integer week;

    public WeekExpenseId() {
    }

    public WeekExpenseId(Long namespaceId, Integer year, Integer month, Integer week) {
    	this.namespaceId = namespaceId;
        this.year = year;
        this.month = month;
        this.week = week;
    }

    public Long getNamespaceId() {
        return namespaceId;
    }

    public void setNamespaceId(Long namespaceId) {
        this.namespaceId = namespaceId;
    }

    public Integer getYear() {
        return year;
    }


    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getWeek() {
        return week;
    }

    public void setWeek(Integer week) {
        this.week = week;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WeekExpenseId that = (WeekExpenseId) o;
        return namespaceId.equals(that.namespaceId) &&
                year.equals(that.year) && 
                month.equals(that.month) &&
                week.equals(that.week);
    }

    @Override
    public int hashCode() {
        return Objects.hash(namespaceId, year, month, week);
    }
}
