#!/usr/bin/env python
import threading, logging, time
import multiprocessing

from kafka import KafkaConsumer, TopicPartition
import json

import MySQLdb
import os

kafka_broker = os.environ['KAFKA_BROKER']
print(kafka_broker)
mysql_db_host = os.environ['MYSQL_DB_HOST']
print(mysql_db_host)
mysql_db_port = os.environ['MYSQL_DB_PORT']
print(mysql_db_port)
mysql_db_user = os.environ['MYSQL_DB_USER']
print(mysql_db_user)
mysql_db_password = os.environ['MYSQL_DB_PASSWORD']
print(mysql_db_password)

#connection = MySQLdb.connect(
#  host = "127.0.0.1",
#  user = "root",
#  passwd = "12345",
#  db ='computemetrics'
#)

def mysql_query(db, query, params):
    cur = db.cursor()
    result = None
    try:
        result = cur.execute(query, params)
    except MySQLdb.Error:
        db.ping(True)
        result = cur.execute(query, params)
    db.commit()
    return(cur)

def get_gpu_id(db, data):
    select_gpuid = (
    "SELECT * FROM `gpus` WHERE `uuid` = %(uuid)s;"
    )
    result = mysql_query(db, select_gpuid, data)
    result = result.fetchone()
    if result != None:
        return(result[0])
    else:
        return(result)

def get_container_id(db, data):
    select_cgid = (
    "SELECT * FROM `containergpus` WHERE `gpu_id` = %(gpu_id)s and `nspid` = %(nspid)s;"
#     "SELECT * FROM `containergpus` WHERE `nspid` = %(nspid)s;"
    )
    result = mysql_query(db, select_cgid, data)
    result = result.fetchone()
    if result != None:
       return(result[2])
    else:
       return(result)

#mysql> SHOW COLUMNS FROM gpus;
#+----------------------+-------------+------+-----+---------+----------------+
#| Field                | Type        | Null | Key | Default | Extra          |
#+----------------------+-------------+------+-----+---------+----------------+
#| id                   | int(10)     | NO   | PRI | NULL    | auto_increment |
#| uuid                 | varchar(64) | NO   |     | NULL    |                |
#| name                 | varchar(32) | NO   |     | NULL    |                |
#| enforced.power.limit | int(4)      | YES  |     | NULL    |                |
#| memory.total         | int(4)      | YES  |     | NULL    |                |
#| hostname             | varchar(32) | NO   |     | NULL    |                |
#+----------------------+-------------+------+-----+---------+----------------+
def insertGpuInfo(db, data):
    select_gpuuuid = (
    "SELECT * FROM `gpus` WHERE `uuid` = %(uuid)s;"
    )
    result = mysql_query(db, select_gpuuuid, data)
    if result.rowcount == 0:
        query = (
                "INSERT INTO `gpus` (`uuid`, `name`, `enforced_power_limit`, `memory_total`, `hostname`) "
                "VALUES (%(uuid)s, %(name)s, %(enforced.power.limit)s, %(memory.total)s, %(hostname)s);"
                )
        result = mysql_query(db, query, data)
    else:
        result = result.fetchone()
        return(result[0])
    return(result.lastrowid)

#+-----------------+-------------+------+-----+---------+----------------+
#| Field           | Type        | Null | Key | Default | Extra          |
#+-----------------+-------------+------+-----+---------+----------------+
#| id              | int(10)     | NO   | PRI | NULL    | auto_increment |
#| gpu_id          | int(10)     | NO   |     | NULL    |                |
#| temperature.gpu | int(4)      | YES  |     | NULL    |                |
#| utilization.gpu | int(4)      | YES  |     | NULL    |                |
#| power.draw      | int(4)      | YES  |     | NULL    |                |
#| memory.used     | int(4)      | YES  |     | NULL    |                |
#| query_time      | varchar(32) | NO   |     | NULL    |                |
#+-----------------+-------------+------+-----+---------+----------------+
def insertGpuMetric(db, data):
    query = (
                "INSERT INTO `gpumetrics` (`gpu_id`, `temperature_gpu`, `utilization_gpu`, `power_draw`, `memory_used`, `query_time`) "
                "VALUES (%(gpu_id)s, %(temperature.gpu)s, %(utilization.gpu)s, %(power.draw)s, %(memory.used)s, %(query_time)s);"
             )
    result = mysql_query(db, query, data)
    return(result.lastrowid)
 
def insertProcessInfo(db, data):
    select_pid = (
    "SELECT * FROM `processes` WHERE `pid` = %(pid)s and `nspid` = %(nspid)s and `start_time` = %(start_time)s;"
    )
    result = mysql_query(db, select_pid, data)
    if result.rowcount == 0:
        query = (
                "INSERT INTO `processes` (`pid`, `nspid`, `command`, `full_command`, `container_id`, `start_time`) "
                "VALUES (%(pid)s, %(nspid)s, %(command)s, %(full_command)s, %(container_id)s, %(start_time)s);"
                )
        result =  mysql_query(db, query, data)
    else:
        result = result.fetchone()
        return(result[0])
    return(result.lastrowid)

def insertProcessMetric(db, data):
    query = (
                "INSERT INTO `processmetrics` (`process_id`, `gpumetric_id`, `gpu_memory_usage`, `cpu_percent`, `cpu_memory_usage`, `query_time`) "
                "VALUES (%(process_id)s, %(gpumetric_id)s, %(gpu_memory_usage)s, %(cpu_percent)s, %(cpu_memory_usage)s, %(query_time)s);"
             )
    result =  mysql_query(db, query, data)
    return(result.lastrowid)

def insertNamespaceInfo(db, data):
# namespace table
#+-------------------------+-------------+------+-----+---------+----------------+
#| Field                   | Type        | Null | Key | Default | Extra          |
#+-------------------------+-------------+------+-----+---------+----------------+
#| id                      | int(10)     | NO   | PRI | NULL    | auto_increment |
#| name                    | varchar(32) | NO   |     | NULL    |                |
#| owner                   | varchar(64) | YES  |     | NULL    |                |
#| limits.cpu              | int(4)      | YES  |     | NULL    |                |
#| limits.memory           | varchar(32) | YES  |     | NULL    |                |
#| limits.nvidia.com/gpu   | int(4)      | YES  |     | NULL    |                |
#| requests.cpu            | int(4)      | YES  |     | NULL    |                |
#| requests.memory         | varchar(32) | YES  |     | NULL    |                |
#| requests.nvidia.com/gpu | int(4)      | YES  |     | NULL    |                |
#+-------------------------+-------------+------+-----+---------+----------------+
    select_nsname = (
    "SELECT * FROM `namespaces` WHERE `name` = %(name)s;"
    )
    result = mysql_query(db, select_nsname, data)
    if result.rowcount == 0:
        query = (
                "INSERT INTO `namespaces` (`name`, `owner`, `limits_cpu`, `limits_memory`, `limits_nvidia_com_gpu`, `requests_cpu`, `requests_memory`, `requests_nvidia_com_gpu`) "
                "VALUES (%(name)s, %(owner)s, %(limits.cpu)s, %(limits.memory)s, %(limits.nvidia.com/gpu)s, %(requests.cpu)s, %(requests.memory)s, %(requests.nvidia.com/gpu)s);"
                )
        result =  mysql_query(db, query, data)
    else:
        result = result.fetchone()
        return(result[0])
    return(result.lastrowid)

def insertNamespaceUsedResourceQuotas(db, data):
# table namespaceusedresourcequotas;
#+-------------------------+-------------+------+-----+---------+----------------+
#| Field                   | Type        | Null | Key | Default | Extra          |
#+-------------------------+-------------+------+-----+---------+----------------+
#| id                      | int(10)     | NO   | PRI | NULL    | auto_increment |
#| namespace_id            | int(10)     | NO   |     | NULL    |                |
#| limits.cpu              | int(4)      | YES  |     | NULL    |                |
#| limits.memory           | varchar(32) | YES  |     | NULL    |                |
#| limits.nvidia.com/gpu   | int(4)      | YES  |     | NULL    |                |
#| requests.cpu            | varchar(32) | YES  |     | NULL    |                |
#| requests.memory         | varchar(32) | YES  |     | NULL    |                |
#| requests.nvidia.com/gpu | int(4)      | YES  |     | NULL    |                |
#| query_time              | varchar(32) | NO   |     | NULL    |                |
#+-------------------------+-------------+------+-----+---------+----------------+
    query = (
                "INSERT INTO `namespaceusedresourcequotas` (`namespace_id`, `limits_cpu`, `limits_memory`, `limits_nvidia_com_gpu`, `requests_cpu`, `requests_memory`, `requests_nvidia_com_gpu`, `query_time`) "
                "VALUES (%(namespace_id)s, %(limits.cpu)s, %(limits.memory)s, %(limits.nvidia.com/gpu)s, %(requests.cpu)s, %(requests.memory)s, %(requests.nvidia.com/gpu)s, %(query_time)s);"
                )
    result =  mysql_query(db, query, data)
    return(result.lastrowid)

def insertPodInfo(db, data):
#    'name':'tf-test-0','start_time':'02/24/202002:32:18UTC','phase':'Running','hostname':'gpu01'
#+--------------+-------------+------+-----+---------+----------------+
#| Field        | Type        | Null | Key | Default | Extra          |
#+--------------+-------------+------+-----+---------+----------------+
#| id           | int(10)     | NO   | PRI | NULL    | auto_increment |
#| name         | varchar(32) | NO   |     | NULL    |                |
#| start_time   | varchar(32) | NO   |     | NULL    |                |
#| namespace_id | int(10)     | NO   |     | NULL    |                |
#| hostname     | varchar(32) | NO   |     | NULL    |                |
#| phase        | varchar(16) | YES  |     | NULL    |                |
#+--------------+-------------+------+-----+---------+----------------+
    select_podname = (
    "SELECT * FROM `pods` WHERE `name` = %(name)s;"
    )
    result = mysql_query(db, select_podname, data)
    if result.rowcount == 0:
        query = (
                "INSERT INTO `pods` (`name`, `start_time`, `namespace_id`, `hostname`, `phase`) "
                "VALUES (%(name)s, %(start_time)s, %(namespace_id)s, %(hostname)s, %(phase)s);"
                )
        result =  mysql_query(db, query, data)
    else:
        result = result.fetchone()
        return(result[0])
    return(result.lastrowid)

def insertContainerInfo(db, data):
#+-------------------------+-------------+------+-----+---------+----------------+
#| Field                   | Type        | Null | Key | Default | Extra          |
#+-------------------------+-------------+------+-----+---------+----------------+
#| id                      | int(10)     | NO   | PRI | NULL    | auto_increment |
#| pod_id                  | int(10)     | NO   |     | NULL    |                |
#| name                    | varchar(32) | NO   |     | NULL    |                |
#| limits.cpu              | varchar(32) | YES  |     | NULL    |                |
#| limits.memory           | varchar(32) | YES  |     | NULL    |                |
#| limits.nvidia.com/gpu   | varchar(32) | YES  |     | NULL    |                |
#| requests.cpu            | varchar(32) | YES  |     | NULL    |                |
#| requests.memory         | varchar(32) | YES  |     | NULL    |                |
#| requests.nvidia.com/gpu | varchar(32) | YES  |     | NULL    |                |
#| nspid                   | bigint(10)  | NO   |     | NULL    |                |
#+-------------------------+-------------+------+-----+---------+----------------+
    select_cname = (
    "SELECT * FROM `containers` WHERE `name` = %(name)s;"
    )
    result = mysql_query(db, select_cname, data)
    if result.rowcount == 0:
        query = (
                "INSERT INTO `containers` (`pod_id`, `name`, `limits_cpu`, `limits_memory`, `limits_nvidia_com_gpu`, `requests_cpu`, `requests_memory`, `requests_nvidia_com_gpu`, `nspid`) "
                "VALUES (%(pod_id)s, %(name)s, %(limits.cpu)s, %(limits.memory)s, %(limits.nvidia.com/gpu)s, %(requests.cpu)s, %(requests.memory)s, %(requests.nvidia.com/gpu)s, %(nspid)s);"
                )
        result =  mysql_query(db, query, data)
    else:
        result = result.fetchone()
        return(result[0])
    return(result.lastrowid)

def insertContainerGpus(db, data):
#+--------------+------------+------+-----+---------+----------------+
#| Field        | Type       | Null | Key | Default | Extra          |
#+--------------+------------+------+-----+---------+----------------+
#| id           | int(10)    | NO   | PRI | NULL    | auto_increment |
#| pod_id       | int(10)    | NO   |     | NULL    |                |
#| container_id | int(10)    | NO   |     | NULL    |                |
#| nspid        | bigint(10) | NO   |     | NULL    |                |
#| gpu_id       | int(10)    | NO   |     | NULL    |                |
#+--------------+------------+------+-----+---------+----------------+
    print(data)
    select_cgname = (
    "SELECT * FROM `containergpus` WHERE `container_id` = %(container_id)s and `gpu_id` = %(gpu_id)s or `gpu_id` = 0;"
    )
    result = mysql_query(db, select_cgname, data)
    if result.rowcount == 0:
        query = (
                "INSERT INTO `containergpus` (`pod_id`, `container_id`, `nspid`, `gpu_id`) "
                "VALUES (%(pod_id)s, %(container_id)s, %(nspid)s, %(gpu_id)s);"
                )
        result =  mysql_query(db, query, data)
    else:
        result = result.fetchone()
        query = (
                "UPDATE `containergpus` SET `gpu_id` = %(gpu_id)s WHERE `id` = %(id)s"
                )
        mysql_query(db, query, {'id': result[0], 'gpu_id': data['gpu_id']})
        return(result[0])
    return(result.lastrowid)

def checkifexist(db, table, data):
    print(data)
    select_querytime = (
    "SELECT * FROM `" + table + "` WHERE `query_time` = %(query_time)s;"
    )
    result = mysql_query(db, select_querytime, data)
    return(result.rowcount != 0)

class Consumer(multiprocessing.Process):
    def __init__(self, topic):
        multiprocessing.Process.__init__(self)
        self.stop_event = multiprocessing.Event()
        self.topic = topic
        self.mypartition = TopicPartition(self.topic, 0)
        self.connection = MySQLdb.connect(
            host = mysql_db_host,
            user = mysql_db_user,
            passwd = mysql_db_password,
            db ='computemetrics'
        )
        
    def stop(self):
        self.stop_event.set()

    def processMessage(self, message):
        #print(type(message.value))
        if self.topic == 'gpu_metrics':
           if type(message.value) == bytes:
               jsonmsg = json.loads(message.value)
               #print(type(jsonmsg))
               #if type(jsonmsg) == str:
               #   jsonmsg = json.loads(jsonmsg)
               if checkifexist(self.connection, 'gpumetrics', {'query_time': jsonmsg['query_time']}):
                   return

               for gpu in jsonmsg['gpus']:
                   gpu_id = insertGpuInfo(self.connection, {
                                              'uuid': gpu['uuid'], \
                                              'name': gpu['name'], \
                                              'enforced.power.limit': gpu['enforced.power.limit'], \
                                              'memory.total': gpu['memory.total'], \
                                              'hostname': jsonmsg['hostname'] \
                                               })
                   print(gpu_id)

    def run(self):
        consumer = KafkaConsumer(bootstrap_servers=kafka_broker+':9092',
                                 auto_offset_reset='earliest',
                                 consumer_timeout_ms=1000)
        consumer.subscribe([self.topic])

        try:
            while not self.stop_event.is_set():
                for message in consumer:
                    self.processMessage(message)
                    #pos = consumer.position(self.mypartition)
                    #print("[most recent offset]=", pos)
                    if self.stop_event.is_set():
                        break
        except KeyboardInterrupt:
           print("stop!")
           self.stop()
       
        consumer.close()
        
def main():
    tasks = [
        Consumer(topic = "gpu_metrics")
    ]

    for t in tasks:
        t.start()

    time.sleep(20)
    
    for task in tasks:
        task.stop()

    for task in tasks:
        task.join()
        
        
if __name__ == "__main__":
    logging.basicConfig(
        format='%(asctime)s.%(msecs)s:%(name)s:%(thread)d:%(levelname)s:%(process)d:%(message)s',
        level=logging.INFO
        )
    main()
