package com.wistron.controller;

import com.wistron.model.Expense;
import com.wistron.model.ExpenseId;
import com.wistron.repository.ExpenseRepository;
import com.wistron.tasks.ExpenseTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

//@CrossOrigin(origins = "http://localhost:8081")
@RestController
//@RequestMapping("/api")
public class ExpenseController {
	private static final Logger log = LoggerFactory.getLogger(ExpenseController.class);

    @Autowired
    ExpenseRepository expenseRepository;

    @GetMapping("/rangeexpenses")
    public ResponseEntity<List<Expense>> getRangeExpense(     		
            @RequestParam(required = false) Long namespaceId,
			@RequestParam(value = "startYear", required = false) Integer startYear,
			@RequestParam(value = "startMonth", required = false) Integer startMonth,
			@RequestParam(value = "endYear", required = false) Integer endYear,
			@RequestParam(value = "endMonth", required = false) Integer endMonth) {
        try {
            List<Expense> expenses = new ArrayList<Expense>();
            if (namespaceId == null)
                expenseRepository.findExpenses(startYear, startMonth, endYear, endMonth).forEach(expenses::add);
            else
            	expenseRepository.findExpensesByNamespaceId(namespaceId, startYear, startMonth, endYear, endMonth).forEach(expenses::add);

            if (expenses.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(expenses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/expenses")
    public ResponseEntity<List<Expense>> getMonthExpense(     		
            @RequestParam(required = false) Long namespaceId,
			@RequestParam(value = "year", required = false) Integer year,
			@RequestParam(value = "month", required = false) Integer month) {
        try {
            List<Expense> expenses = new ArrayList<Expense>();
            if (year == null && month == null) {
            	// Choose time zone in which you want to interpret your Date
            	Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Taipei"));
            	year = cal.get(Calendar.YEAR);
            	month = cal.get(Calendar.MONTH);
            }

        	log.info("year {}, month {}", year, month + 1);
            if (namespaceId == null) {
                expenseRepository.findMonthExpenses(year, month + 1).forEach(expenses::add);
            	log.info("expense size {}:", expenses.size());
            } else
            	expenseRepository.findMonthExpensesByNamespaceId(namespaceId, year, month).forEach(expenses::add);

            if (expenses.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(expenses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}