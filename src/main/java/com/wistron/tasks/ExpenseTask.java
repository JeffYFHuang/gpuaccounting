package com.wistron.tasks;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.wistron.model.Container;
import com.wistron.model.DayExpense;
import com.wistron.model.DayExpenseId;
import com.wistron.model.Expense;
import com.wistron.model.ExpenseId;
import com.wistron.model.GPU;
import com.wistron.model.Gpumetric;
import com.wistron.model.Namespace;
import com.wistron.model.Namespaceusedresourcequota;
import com.wistron.model.Pod;
import com.wistron.model.Process;
import com.wistron.model.Processmetric;
import com.wistron.model.WeekExpense;
import com.wistron.model.WeekExpenseId;
import com.wistron.repository.DayExpenseRepository;
import com.wistron.repository.ExpenseRepository;
import com.wistron.repository.GpumetricRepository;
import com.wistron.repository.NamespaceRepository;
import com.wistron.repository.NamespaceusedresourcequotaRepository;
import com.wistron.repository.PodRepository;
import com.wistron.repository.WeekExpenseRepository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class ExpenseTask {
	  private static final Logger log = LoggerFactory.getLogger(ExpenseTask.class);
	  private static final SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy00:00:00"); // "05/27/202010:51:38CST"
	  private static final SimpleDateFormat dateFormat2 = new SimpleDateFormat("MM/dd/yyyyHH:mm:ss"); 

	  @Autowired
	  NamespaceRepository namespaceRepository;

	  @Autowired
	  PodRepository podRepository;

	  @Autowired
	  NamespaceusedresourcequotaRepository namespaceusedresourcequotaRepository;
	  
	  @Autowired
	  ExpenseRepository expenseRepository;

	  @Autowired
	  DayExpenseRepository dayExpenseRepository;
	  
	  @Autowired
	  WeekExpenseRepository weekExpenseRepository;

	  @Autowired
	  GpumetricRepository gpumetricRepository;

	  
	 public List<Pod> getPods(Long nsid) {
		 return podRepository.findByNamespaceIdEquals(nsid);
	 }

	  @Scheduled(fixedRate = 5000)
	  public void calcuMonth() {
       // try {
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
        	try {
        		thisMonthFirstDay = dateFormat2.parse(startDateTime);
        		nextMonthFirstDay = dateFormat2.parse(endDateTime);
        	} catch (Exception e) {
        		return;
        	}
        	//log.info("The time is now {}", new Date());
            //log.info("The month start time is {}, end time is {}", startDateTime, endDateTime);

            List<Namespace> namespaces = new ArrayList<Namespace>();
            namespaceRepository.findAll().forEach(namespaces::add);

            //log.info("namespaces size {}", namespaces.size());
            //List<Expense> expenses = new ArrayList<Expense>();
            for (int i = 0; i < namespaces.size(); i++) {
            	Namespace namespace = namespaces.get(i);
            	Long namespaceId = namespace.getId();
            	//log.info("i {} namespaceId {}", i, namespaceId);

        		List<Pod> pods = getPods(namespace.getId()); 

        		//log.info("namespaceId {} pod size: {}", namespaceId, pods.size());
            	ExpenseId expenseId = new ExpenseId(namespaceId, year, month);
            	Expense expense = new Expense(expenseId);

        		try {
        			// to do namespaceusedresourcequotaRepository.findOne(example);
        			expense.calExpense(thisMonthFirstDay, nextMonthFirstDay, pods);
        			expenseRepository.save(expense);
        		} catch (Exception e) {
        			log.info(e.toString());
        		}
            }

       // } catch (Exception e) {
        //	log.info("The time is now {}", dateFormat.format(new Date()) + "CST");
        //}
      }

	  public List<Date> getTimes(List<Pod> pods) {
		  List<Date> times = new ArrayList<Date>();
		  
		  for (int i = 0; i < pods.size(); i++) {
			  try {
				Date time = dateFormat2.parse(pods.get(i).getStartTime());
				time.setTime(time.getTime() + 8 * 3600000);
				times.add(time);
			    times.add(dateFormat2.parse(pods.get(i).getQueryTime()));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		  }
		  
		  Collections.sort(times, (o1, o2) -> o1.compareTo(o2));
		  return times;
	  }
/*
	  @Scheduled(fixedRate = 30000)
	  public void calCurrentResourceQuota() {
		    Date now = new Date();
		    now.setTime(now.getTime() - 10000);
		    //String qt = dateFormat.format(now) + "CST";
            List<Namespace> namespaces = new ArrayList<Namespace>();
            namespaceRepository.findAll().forEach(namespaces::add);

            //log.info("namespaces size {}", namespaces.size());
            //List<Expense> expenses = new ArrayList<Expense>();
            for (int i = 0; i < namespaces.size(); i++) {
            	Namespace namespace = namespaces.get(i);
            	Long namespaceId = namespace.getId();
            	log.info("i {} namespaceId {}", i, namespaceId);

            	List<Pod> pods = getPods(namespace.getId());

        		try {
        			// to do namespaceusedresourcequotaRepository.findOne(example);
        			Namespaceusedresourcequota rq = Expense.calCurrentResourceQuota(now, pods);
        			rq.setNamespaceId(namespace.getId());
        			rq.setQueryTime(dateFormat2.format(now) + "CST");
        			List<Namespaceusedresourcequota> rqList = namespaceusedresourcequotaRepository.findTopByOrderByIdDesc(namespace.getId());
        			
        			if(!rqList.isEmpty()) {
        				Namespaceusedresourcequota rq0 = rqList.get(0);
        				//log.info("rq0: {}", rq0.toString());
        				//log.info("rq: {}", rq.toString());
	        			if (rq0.equals(rq)) {
	        				rq0.setQueryTime(rq.getQueryTime());
	        				namespaceusedresourcequotaRepository.save(rq0);
	        			} else {
	        				rq.setStartTime(rq.getQueryTime());
	        				namespaceusedresourcequotaRepository.save(rq);
	        			}
        			}
        		} catch (Exception e) {
        			log.info(e.toString());
        		}
        	}

       // } catch (Exception e) {
        //	log.info("The time is now {}", dateFormat.format(new Date()) + "CST");
        //}
      }
*/
	  @Scheduled(fixedRate = 60000)
	  public void calCurrentResourceQuota() {
		    Date now = new Date();
		    now.setTime(now.getTime() - 10000);
		    //String qt = dateFormat.format(now) + "CST";
            List<Namespace> namespaces = new ArrayList<Namespace>();
            namespaceRepository.findAll().forEach(namespaces::add);

            //log.info("namespaces size {}", namespaces.size());
            //List<Expense> expenses = new ArrayList<Expense>();
            for (int i = 0; i < namespaces.size(); i++) {
            	Namespace namespace = namespaces.get(i);
            	Long namespaceId = namespace.getId();
            	//log.info("i {} namespaceId {}", i, namespaceId);

        		List<Pod> pods = getPods(namespaceId);
        		List<Date> times = getTimes(pods);

        		//log.info("times size:", times.size());
        		for (int m = 1; m < times.size(); m++) {
	        		try {
	        			//log.info("{}", times.get(m));
	        			// to do namespaceusedresourcequotaRepository.findOne(example);
	        			Namespaceusedresourcequota rq = Expense.calCurrentResourceQuota(times.get(m-1), times.get(m), pods);
	        			rq.setNamespaceId(namespace.getId());
	        			rq.setQueryTime(dateFormat2.format(times.get(m)) + "CST");
	        			List<Namespaceusedresourcequota> rqList = namespaceusedresourcequotaRepository.findTopByOrderByIdDesc(namespace.getId());
	        			
	        			if(!rqList.isEmpty()) {
	        				boolean found = false;
	        				for(Namespaceusedresourcequota rq0 : rqList){
	        					if (rq0.getStartTime().equalsIgnoreCase(rq.getStartTime())) {
	        						found = true;
	        						if (namespaceId == 17) {
		    	        				log.info("rq0: {}", rq0.toString());
		    	        				log.info("rq: {}", rq.toString());
	        						}
	        						rq0.setQueryTime(rq.getQueryTime());
		        					namespaceusedresourcequotaRepository.save(rq0);
		        					break;
	        					}
	        				}
	        				
		        			if (!found) {
		        				//rq.setStartTime(rq.getQueryTime());
		        				namespaceusedresourcequotaRepository.save(rq);
		        			}
	        			}
	        		} catch (Exception e) {
	        			log.info(e.toString());
	        		}
        		}
        	}

       // } catch (Exception e) {
        //	log.info("The time is now {}", dateFormat.format(new Date()) + "CST");
        //}
      }
	  
	  /*
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
            //log.info("The week start time is {}, end time is {}", startDateTime, endDateTime);

            List<Namespace> namespaces = new ArrayList<Namespace>();
            namespaceRepository.findAll().forEach(namespaces::add);

            //log.info("namespaces size {}", namespaces.size());
            //List<Expense> expenses = new ArrayList<Expense>();
            for (int i = 0; i < namespaces.size(); i++) {
            	Namespace namespace = namespaces.get(i);
            	Long namespaceId = namespace.getId();
            	//log.info("i {} namespaceId {}", i, namespaceId);

        		List<Pod> pods = getPods(namespace.getId()); 

        		log.info("namespaceId {} pod size: {}", namespaceId, pods.size());
            	ExpenseId expenseId = new ExpenseId(namespaceId, year, month);
            	Expense expense = new Expense(expenseId);

        		try {
        			expense.calExpense(thisWeekFirstDay, nextWeekFirstDay, pods);
        			expenseRepository.save(expense);
        		} catch (Exception e) {
        			log.info(e.toString());
        		}
            }
            
        } catch (Exception e) {
        	//log.info("The time is now {}", dateFormat.format(new Date()) + "CST");
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
            	Namespace namespace = namespaces.get(i);
            	Long namespaceId = namespaces.get(i).getId();
            	//log.info("i {} namespaceId {}", i, namespaceId);
        		double gpuUsedHours = 0;
        		double gpuMUsedHours = 0;
        		double cpuUsedHours = 0;
        		double memoryUsedHour = 0;
        		double total_time = 0;
        		List<Pod> pods = getPods(namespace.getId());

        		//log.info("pod size: {}", pods.size());
        		for (int j = 0; j < pods.size(); j++) {
        			Pod pod = pods.get(j);
        			try {
        				//log.info("pod queryTime: {}", pod.getQueryTime());
        				Date queryTime = new SimpleDateFormat("MM/dd/yyyyHH:mm:ss").parse(pod.getQueryTime());
            			if (queryTime.after(thisDay) && queryTime.before(nextDay)) {
            				List<Container> containers = pod.getContainers();
            				for (int k = 0; k < containers.size(); k++) {
            					Container container = containers.get(k);
            					List<Process> processes = null;//container.getProcesses();
            					int size = processes == null ? 0 : processes.size();
            					//log.info("process size: {}",  processes.size());
            					for (int m = 0; m < size; m++) {
            						Process process = processes.get(m);
            						List<Processmetric> processmetrics = process.getProcessmetrics();
            						Map<Long, List<Processmetric>> computemetrics = new HashMap<Long, List<Processmetric>>();
            						//log.info("processmetrics size: {}",  processmetrics.size());
            						for (int n = 0; n < processmetrics.size(); n++) {
            							Processmetric gp = processmetrics.get(n);
            							Long gpu_id = gp.getGpumetric().getGpuId();
            							Date qt = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").parse(gp.getQueryTime());
            							if (qt.before(thisDay) || qt.after(nextDay))
            								continue;
            					        if (computemetrics.containsKey(gpu_id)) {
            					        	computemetrics.get(gpu_id).add(gp);
            					        	//log.info("add");
            					            
            					        } else {
            					        	List<Processmetric> pms = new ArrayList<Processmetric>();
            					        	pms.add(gp);
            					        	computemetrics.put(gpu_id, pms);
            					        	//log.info("add");
            					        }
            						}
            						
            						//log.info("map size {}", computemetrics.size());
            						for (Map.Entry<Long, List<Processmetric>> entry : computemetrics.entrySet()) {
            							List<Processmetric> pms = entry.getValue();
                						Collections.sort(pms);
            							//log.info("gpu_id {} pms size {} ", entry.getKey(), pms.size());
	            						for (int n = 0; n < pms.size()-1; n++) {
	    	            					Processmetric gp = pms.get(n);
	    	            					Processmetric gp1 = pms.get(n+1);
	    	            					//log.info("gpu id {}: ", gp.getGpumetric().getGpuId());
	    	            					//log.info("{} {}", gp.getQueryTime(), gp1.getQueryTime());
	    	            					Date st = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse(gp.getQueryTime());
	    	            					Date et = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse(gp1.getQueryTime());
	    	            				    long diffInMillies = Math.abs(et.getTime() - st.getTime());
	    	            				    //long diff = TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);
	    	            					//log.info(gp.getProcessId().toString());
	    	            					//log.info("{}, {}, {}, {}", gp.getId(), gp1.getId(), st, et);
	    	            					//log.info("diff {}, {}, {}, {}, {}", diffInMillies, gp.getCpuPercent(), (double)gp.getCpuMemoryUsage()/(1024.0*1024.0*1024.0), gp.getGpumetric().getUtilizationGpu(), gp.getGpuMemoryUsage());
	    	            					double dur = (double)diffInMillies/1000.0;
	    	            					total_time += dur;
	    	            					cpuUsedHours += (double)gp.getCpuPercent()/100.0 * dur;
	    	            					memoryUsedHour += (double)gp.getCpuMemoryUsage()/(1024.0*1024.0*1024.0) * dur;
	    			            			gpuMUsedHours += (double)gp.getGpuMemoryUsage()/(32.0*1024.0) * dur;
	    			            			gpuUsedHours += (double)gp.getGpumetric().getUtilizationGpu()/100.0 * dur;
	    	            					//log.info("used {}, {}, {}, {}", cpuUsedHours, memoryUsedHour, gpuUsedHours, gpuMUsedHours);
	            							//log.info(processmetrics.get(n).getGpumetric().toString());
	            						}
            						}
            					}
            				}
            			}
        			} catch (Exception e){
        				log.info(e.toString());
        				break;
        			}
        		}

        		//log.info("{}, {}, {}, {}, {}", total_time, cpuUsedHours, memoryUsedHour, gpuUsedHours, gpuMUsedHours);
        		//log.info("{}, {}, {}, {}, {}", total_time/3600.0, cpuUsedHours/3600.0, memoryUsedHour/3600.0, gpuUsedHours/3600.0, gpuMUsedHours/3600.0);
            	//log.info("i {} namespaceId {}", i, namespaceId, gpus.size());
            	DayExpenseId expenseId = new DayExpenseId(namespaceId, year, month, day);
            	DayExpense expense = new DayExpense(expenseId);

            	expense.setCpuUsedHours((float)(cpuUsedHours/3600.0));
            	expense.setMemoryUsedHours((float)(memoryUsedHour/3600.0));
            	expense.setGpuUsedHours((float)(gpuUsedHours/3600.0));
            	expense.setGpuMUsedHours((float)(gpuMUsedHours/3600.0));

                List<Namespaceusedresourcequota> namespaceusedresourcequotas = new ArrayList<Namespaceusedresourcequota>();
            	namespaceusedresourcequotaRepository.findNamespaceusedresourcequotasByNamespaceId(namespaceId, startDateTime, endDateTime)
            	                                    .forEach(namespaceusedresourcequotas::add);
            	//log.info("namespaceId {}, size: {}", namespaceId, namespaceusedresourcequotas.size());
            	if (namespaceusedresourcequotas.size() < 1) continue;

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
      */
}
