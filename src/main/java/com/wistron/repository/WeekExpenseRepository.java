package com.wistron.repository;

import com.wistron.model.WeekExpense;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WeekExpenseRepository extends JpaRepository<WeekExpense, Long> {
}