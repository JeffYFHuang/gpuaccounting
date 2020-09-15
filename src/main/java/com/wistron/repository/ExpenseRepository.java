package com.wistron.repository;

import com.wistron.model.Container;
import com.wistron.model.Expense;
import com.wistron.model.ExpenseId;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
	@Query(value = "SELECT u FROM Expense u WHERE u.expenseId.year >= :startYear AND u.expenseId.month >= :startMonth AND :endYear >= u.expenseId.year AND :endMonth >= u.expenseId.month")
	List<Expense> findExpenses(
			@Param("startYear") Integer startYear,
			@Param("startMonth") Integer startMonth,
			@Param("endYear") Integer endYear,
			@Param("endMonth") Integer endMonth);

	@Query(value = "SELECT u FROM Expense u WHERE u.expenseId.namespaceId = :namespaceId AND u.expenseId.year >= :startYear AND u.expenseId.month >= :startMonth AND u.expenseId.year <= :endYear AND u.expenseId.month <= :endMonth")
	List<Expense> findExpensesByNamespaceId(
			@Param("namespaceId") Long namespaceId,
			@Param("startYear") Integer startYear,
			@Param("startMonth") Integer startMonth,
			@Param("endYear") Integer endYear,
			@Param("endMonth") Integer endMonth);

/*	@Query(value = "SELECT * FROM expenses WHERE year = :year AND month = :month", nativeQuery = true)
	List<Expense> findMonthExpenses(
			@Param("year") Integer year,
			@Param("month") Integer month);*/

	@Query(value = "SELECT u FROM Expense u WHERE u.expenseId.year = :year AND u.expenseId.month = :month")
	List<Expense> findMonthExpenses(
			@Param("year") Integer year,
			@Param("month") Integer month);

	@Query(value = "SELECT u FROM Expense u WHERE u.expenseId.namespaceId = :namespaceId AND u.expenseId.year = :year AND u.expenseId.month = :month")
	List<Expense> findMonthExpensesByNamespaceId(
			@Param("namespaceId") Long namespaceId,
			@Param("year") Integer year,
			@Param("month") Integer month);
}