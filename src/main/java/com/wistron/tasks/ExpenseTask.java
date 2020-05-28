package com.wistron.tasks;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.wistron.model.DayExpense;
import com.wistron.model.DayExpenseId;
import com.wistron.model.Expense;
import com.wistron.model.ExpenseId;
import com.wistron.model.Namespace;
import com.wistron.model.Namespaceusedresourcequota;
import com.wistron.model.WeekExpense;
import com.wistron.model.WeekExpenseId;
import com.wistron.repository.DayExpenseRepository;
import com.wistron.repository.ExpenseRepository;
import com.wistron.repository.NamespaceRepository;
import com.wistron.repository.NamespaceusedresourcequotaRepository;
import com.wistron.repository.WeekExpenseRepository;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Component
public class ExpenseTask {
	  private static final Logger log = LoggerFactory.getLogger(ExpenseTask.class);
	  private static final SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy00:00:00"); // "05/27/202010:51:38CST"

	  @Autowired
	  NamespaceRepository namespaceRepository;

	  @Autowired
	  NamespaceusedresourcequotaRepository namespaceusedresourcequotaRepository;
	  
	  @Autowired
	  ExpenseRepository expenseRepository;

	  @Autowired
	  DayExpenseRepository dayExpenseRepository;
	  
	  @Autowired
	  WeekExpenseRepository weekExpenseRepository;

	  @Scheduled(fixedRate = 5000)
	  public void calcuMonth() {
        try {
        	Calendar calendar = Calendar.getInstance();         
        	//calendar.add(Calendar.MONTH, 1);
        	calendar.set(Calendar.DATE, calendar.getActualMinimum(Calendar.DAY_OF_MONTH));
        	Date thisMonthFirstDay = calendar.getTime();
        	int year = calendar.get(Calendar.YEAR);
        	int month = calendar.get(Calendar.MONTH) + 1;
        	calendar.set(Calendar.DATE, calendar.getActualMaximum(Calendar.DAY_OF_MONTH) + 1);
        	Date nextMonthFirstDay = calendar.getTime();
        	String startDateTime = dateFormat.format(thisMonthFirstDay) + "CST";
        	String endDateTime = dateFormat.format(nextMonthFirstDay) + "CST";
        	thisMonthFirstDay = new SimpleDateFormat("MM/dd/yyyyHH:mm:ss").parse(startDateTime);
        	nextMonthFirstDay = new SimpleDateFormat("MM/dd/yyyyHH:mm:ss").parse(endDateTime);
        	//log.info("The time is now {}", new Date());
            log.info("The month start time is {}, end time is {}", startDateTime, endDateTime);

            List<Namespace> namespaces = new ArrayList<Namespace>();
            namespaceRepository.findAll().forEach(namespaces::add);

            //log.info("namespaces size {}", namespaces.size());
            //List<Expense> expenses = new ArrayList<Expense>();
            for (int i = 0; i < namespaces.size(); i++) {
            	Long namespaceId = namespaces.get(i).getId();
            	//log.info("i {} namespaceId {}", i, namespaceId);
            	ExpenseId expenseId = new ExpenseId(namespaceId, year, month);
            	Expense expense = new Expense(expenseId);

                List<Namespaceusedresourcequota> namespaceusedresourcequotas = new ArrayList<Namespaceusedresourcequota>();
            	namespaceusedresourcequotaRepository.findNamespaceusedresourcequotasByNamespaceId(namespaceId, startDateTime, endDateTime)
            	                                    .forEach(namespaceusedresourcequotas::add);
            	//log.info("namespaceId {}, size: {}", namespaceId, namespaceusedresourcequotas.size());
            	if (namespaceusedresourcequotas.size() == 0) continue;

        		try {
        			expense.calExpense(thisMonthFirstDay, nextMonthFirstDay, namespaceusedresourcequotas);
        			expenseRepository.save(expense);
        		} catch (Exception e) {
        			log.info(e.toString());
        		}
            }

        } catch (Exception e) {
        	log.info("The time is now {}", dateFormat.format(new Date()) + "CST");
        }
      }
	  
	  @Scheduled(fixedRate = 5000)
	  public void calcuWeek() {
        try {
        	Calendar calendar = Calendar.getInstance();
        	calendar.set(Calendar.DAY_OF_WEEK, calendar.getFirstDayOfWeek());
        	Date thisWeekFirstDay = calendar.getTime();
        	int year = calendar.get(Calendar.YEAR);
        	int month = calendar.get(Calendar.MONTH) + 1;
        	int week = calendar.get(Calendar.WEEK_OF_YEAR);

        	calendar.add(Calendar.WEEK_OF_YEAR, 1);
        	Date nextWeekFirstDay = calendar.getTime();
        	String startDateTime = dateFormat.format(thisWeekFirstDay) + "CST";
        	String endDateTime = dateFormat.format(nextWeekFirstDay) + "CST";
        	thisWeekFirstDay = new SimpleDateFormat("MM/dd/yyyyHH:mm:ss").parse(startDateTime);
        	nextWeekFirstDay = new SimpleDateFormat("MM/dd/yyyyHH:mm:ss").parse(endDateTime);
        	//log.info("The time is now {}", new Date());
            log.info("The week start time is {}, end time is {}", startDateTime, endDateTime);

            List<Namespace> namespaces = new ArrayList<Namespace>();
            namespaceRepository.findAll().forEach(namespaces::add);

            //log.info("namespaces size {}", namespaces.size());
            //List<Expense> expenses = new ArrayList<Expense>();
            for (int i = 0; i < namespaces.size(); i++) {
            	Long namespaceId = namespaces.get(i).getId();
            	//log.info("i {} namespaceId {}", i, namespaceId);
            	WeekExpenseId expenseId = new WeekExpenseId(namespaceId, year, month, week);
            	WeekExpense expense = new WeekExpense(expenseId);

                List<Namespaceusedresourcequota> namespaceusedresourcequotas = new ArrayList<Namespaceusedresourcequota>();
            	namespaceusedresourcequotaRepository.findNamespaceusedresourcequotasByNamespaceId(namespaceId, startDateTime, endDateTime)
            	                                    .forEach(namespaceusedresourcequotas::add);
            	//log.info("namespaceId {}, size: {}", namespaceId, namespaceusedresourcequotas.size());
            	if (namespaceusedresourcequotas.size() == 0) continue;

        		try {
        			expense.calWeekExpense(thisWeekFirstDay, nextWeekFirstDay, namespaceusedresourcequotas);
        			weekExpenseRepository.save(expense);
        		} catch (Exception e) {
        			log.info(e.toString());
        		}
            }
            
        } catch (Exception e) {
        	log.info("The time is now {}", dateFormat.format(new Date()) + "CST");
        }
      }

	  @Scheduled(fixedRate = 5000)
	  public void calcuDay() {
        try {
        	Calendar calendar = Calendar.getInstance();
        	int year = calendar.get(Calendar.YEAR);
        	int month = calendar.get(Calendar.MONTH) + 1;
        	int day = calendar.get(Calendar.DAY_OF_MONTH);
        	Date thisDay = calendar.getTime();
        	calendar.add(Calendar.DATE, 1);
        	Date nextDay = calendar.getTime();
        	String startDateTime = dateFormat.format(thisDay) + "CST";
        	String endDateTime = dateFormat.format(nextDay) + "CST";
        	thisDay = new SimpleDateFormat("MM/dd/yyyyHH:mm:ss").parse(startDateTime);
        	nextDay = new SimpleDateFormat("MM/dd/yyyyHH:mm:ss").parse(endDateTime);
        	//log.info("The time is now {}", new Date());
            //log.info("The day start time is {}, end time is {}", startDateTime, endDateTime);

            List<Namespace> namespaces = new ArrayList<Namespace>();
            namespaceRepository.findAll().forEach(namespaces::add);

            //log.info("namespaces size {}", namespaces.size());
            //List<Expense> expenses = new ArrayList<Expense>();
            for (int i = 0; i < namespaces.size(); i++) {
            	Long namespaceId = namespaces.get(i).getId();
            	//log.info("i {} namespaceId {}", i, namespaceId);
            	DayExpenseId expenseId = new DayExpenseId(namespaceId, year, month, day);
            	DayExpense expense = new DayExpense(expenseId);

                List<Namespaceusedresourcequota> namespaceusedresourcequotas = new ArrayList<Namespaceusedresourcequota>();
            	namespaceusedresourcequotaRepository.findNamespaceusedresourcequotasByNamespaceId(namespaceId, startDateTime, endDateTime)
            	                                    .forEach(namespaceusedresourcequotas::add);
            	//log.info("namespaceId {}, size: {}", namespaceId, namespaceusedresourcequotas.size());
            	if (namespaceusedresourcequotas.size() == 0) continue;

        		try {
        			expense.calDayExpense(thisDay, nextDay, namespaceusedresourcequotas);
        			dayExpenseRepository.save(expense);
        		} catch (Exception e) {
        			log.info(e.toString());
        		}
            }
            
        } catch (Exception e) {
        	log.info("The time is now {}", dateFormat.format(new Date()) + "CST");
        }
      }
}
