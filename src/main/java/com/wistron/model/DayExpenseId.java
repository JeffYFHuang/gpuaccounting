package com.wistron.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class DayExpenseId implements Serializable {

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

    @Column(name = "day")
    private Integer day;

    public DayExpenseId() {
    }

    public DayExpenseId(Long namespaceId, Integer year, Integer month, Integer day) {
    	this.namespaceId = namespaceId;
        this.year = year;
        this.month = month;
        this.day = day;
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

    public Integer getDay() {
        return day;
    }

    public void setDay(Integer day) {
        this.day = day;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DayExpenseId that = (DayExpenseId) o;
        return namespaceId.equals(that.namespaceId) &&
                year.equals(that.year) && 
                month.equals(that.month) &&
                day.equals(that.day);
    }

    @Override
    public int hashCode() {
        return Objects.hash(namespaceId, year, month, day);
    }
}
