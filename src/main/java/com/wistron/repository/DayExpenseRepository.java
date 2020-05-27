package com.wistron.repository;

import com.wistron.model.DayExpense;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DayExpenseRepository extends JpaRepository<DayExpense, Long> {
}