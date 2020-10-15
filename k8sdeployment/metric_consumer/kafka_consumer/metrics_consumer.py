#!/usr/bin/env python
import threading, logging, time
import multiprocessing as mp

from kafka import KafkaConsumer, TopicPartition
import json

import MySQLdb
import os
import re

kafka_broker = os.environ['KAFKA_BROKER']
print(kafka_broker)
mysql_db_host = os.environ['MYSQL_DB_HOST']
print(mysql_db_host)
mysql_db_port = os.environ['MYSQL_DB_PORT']
print(mysql_db_port)
mysql_db_user = os.environ['MYSQL_DB_USER']
print(mysql_db_user)
mysql_db_password = os.environ['MYSQL_DB_PASSWORD']

#mysql_db_host = '10.35.64.23'
#print(mysql_db_host)
#mysql_db_port = '3306'
#print(mysql_db_port)
#mysql_db_user = 'springuser'
#print(mysql_db_user)
#mysql_db_password = 'springuser'
print(mysql_db_password)

#connection = MySQLdb.connect(
#  host = "127.0.0.1",
#  user = "root",
#  passwd = "12345",
#  db ='computemetrics'
#)
#gpu_info = mp.Manager().dict();
def conv2G(string):
    print(type(string))
    if type(string) == type(None):
        return(0)
    if type(string) == type(''):
        value = float((re.findall("(\d+(\.\d*)?)", string)[0])[0])
        if string.find('Mi') != -1:
            return (value/1024.0)
        if string.find('m') != -1:
            return (value/1000.0)
        return(value)
    return(float(string))

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
    "SELECT * FROM `containergpus` WHERE `gpu_id` = %(gpu_id)s and `nspid` = %(nspid)s ORDER BY `id` DESC;"
    #"SELECT * FROM `containergpus` WHERE `nspid` = %(nspid)s;"
    )
    result = mysql_query(db, select_cgid, data)
    result = result.fetchone()
    if result != None:
       return(result[1])
    else:
       return(result)

def get_namespace_id(db, data):
    select_cgid = (
    "SELECT * FROM `containergpus` WHERE `gpu_id` = %(gpu_id)s and `nspid` = %(nspid)s ORDER BY `id` DESC;"
    #"SELECT * FROM `containergpus` WHERE `nspid` = %(nspid)s;"
    )
    result = mysql_query(db, select_cgid, data)
    result = result.fetchone()
    if result != None:
       return(result[5])
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
def insertGpuInfo(db, data, update = False):
    query = ''
    if not update:
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
            return(result.lastrowid)

        return(result.fetchone()[0])
    else:
        #sqlcmd = ''
        #if data.get('user') != None:
        sqlcmd = "UPDATE `gpus` set `user` = %(user)s  where `id` = %(id)s"
        if data.get('used') != None:
            if data.get('used') == 0:
                data['used'] = None
            sqlcmd = "UPDATE `gpus` set `used` = %(used)s  where `id` = %(id)s"
        query = (
                sqlcmd
        )

        mysql_query(db, query, data)
        return(data['id'])

def get_gpu_info_db(db, data, type = 0):
    query = ''
    if type == 0: #fetch user
        query = (
            "SELECT `id`, `user` FROM `gpus` where `user` is not null;"
        )
    if type == 1: #fetch used
        query = (
            "SELECT `id`, `used` FROM `gpus` where `used` is not null and `hostname` = %(hostname)s;"
        )

    result = mysql_query(db, query, data)
    t = result.fetchall()
    #print("tttttt", t)
    return dict((x, y) for x, y in t)

def insertCurrentGpuMetric(db, data):
    print(data)
    select_gpu_metric = (
        "SELECT * FROM `currentgpumetrics` WHERE `gpu_id` = %(gpu_id)s ORDER BY `id` DESC;"
    )
    result = mysql_query(db, select_gpu_metric, data)

    print(result.rowcount)
    found = False
    if result != None and result.rowcount != 0:
        found = True

    if found == False:
        #print(data)
        query = (
                "INSERT INTO `currentgpumetrics` (`gpu_id`, `temperature_gpu`, `utilization_gpu`, `power_draw`, `memory_used`, `query_time`) "
                "VALUES (%(gpu_id)s, %(temperature.gpu)s, %(utilization.gpu)s, %(power.draw)s, %(memory.used)s, %(query_time)s);"
             )
        result = mysql_query(db, query, data)
        #print("gpu metric insert : " + str(data))
        return(result.lastrowid)
    else:
        query = (
            "UPDATE `gpumetrics` SET `query_time` = %(query_time)s, `temperature_gpu` = %(temperature.gpu)s, `utilization_gpu` = %('utilization.gpu')s, `power_draw` = %(power.draw)s, `memory_used` = %(memory.used)s, WHERE `id` = %(id)s"
        )
        mysql_query(db, query, {'id': result[0], 'query_time': data['query_time']})

    #result = result.fetchone()
    return(result[0])

def insertGpuMetric(db, data):
    select_gpu_metric = (
        "SELECT * FROM `gpumetrics` WHERE `gpu_id` = %(gpu_id)s ORDER BY `id` DESC;"
    )
    result = mysql_query(db, select_gpu_metric, data)

    #print(data)
    found = True
    if result.rowcount == 0:
        found = False
    else:
        result = result.fetchone()
        #print(result)
#+----+--------+-------------+------------+----------------------------+-----------------+-----------------+
#| id | gpu_id | memory_used | power_draw | query_time                 | temperature_gpu | utilization_gpu |
#+----+--------+-------------+------------+----------------------------+-----------------+-----------------+
#|  1 |      1 |           0 |         49 | 2020-03-04T13:36:35.971960 |              31 |               0 |

        #(33, 26, 0, 48, '2020-03-04T13:36:41.074563', 29, 0)
        #print(float(result[1]) == float(data['cpu_memory_usage']))
        if float(result[2]) != float(data['memory.used']):
            found = False
        if float(result[3]) != float(data['power.draw']):
            found = False
        if float(result[5]) != float(data['temperature.gpu']):
            found = False
        if float(result[6]) != float(data['utilization.gpu']):
            found = False
        #if found == False:
        #    print(result)

    if found == False:
        #print(data)
        query = (
                "INSERT INTO `gpumetrics` (`gpu_id`, `temperature_gpu`, `utilization_gpu`, `power_draw`, `memory_used`, `query_time`) "
                "VALUES (%(gpu_id)s, %(temperature.gpu)s, %(utilization.gpu)s, %(power.draw)s, %(memory.used)s, %(query_time)s);"
             )
        result = mysql_query(db, query, data)
        #print("gpu metric insert : " + str(data))
        return(result.lastrowid)
    else:
        query = (
            "UPDATE `gpumetrics` SET `query_time` = %(query_time)s WHERE `id` = %(id)s"
        )
        mysql_query(db, query, {'id': result[0], 'query_time': data['query_time']})

    #result = result.fetchone()
    return(result[0])
 
def insertProcessInfo(db, data):
    select_pid = (
        "SELECT * FROM `processes` WHERE `pid` = %(pid)s and `nspid` = %(nspid)s and `container_id` = %(container_id)s and `start_time` = %(start_time)s;"
    )
    result = mysql_query(db, select_pid, data)
    if result.rowcount == 0:
        query = (
                "INSERT INTO `processes` (`pid`, `nspid`, `command`, `full_command`, `container_id`, `start_time`) "
                "VALUES (%(pid)s, %(nspid)s, %(command)s, %(full_command)s, %(container_id)s, %(start_time)s);"
                )
        result =  mysql_query(db, query, data)
        return(result.lastrowid)

    result = result.fetchone()
    query = (
        "UPDATE `processes` SET `query_time` = %(query_time)s WHERE `id` = %(id)s"
    )
    mysql_query(db, query, {'id': result[0], 'query_time': data['query_time']})
    return(result[0])

def insertProcessMetric(db, data):
    select_process_metric = (
        "SELECT * FROM `processmetrics` WHERE `process_id` = %(process_id)s and `gpumetric_id` = %(gpumetric_id)s ORDER BY `id` DESC;"
    )
    result = mysql_query(db, select_process_metric, data)

    found = True
    if result.rowcount == 0:
        found = False
    else:
        result = result.fetchone()
        #(2, 543834112, 0.0, 307, 11, 1, '2020-03-04T13:36:35.971960')
        #print(float(result[1]) == float(data['cpu_memory_usage']))
        if float(result[1]) != float(data['cpu_memory_usage']):
            found = False
        if float(result[2]) != float(data['cpu_percent']):
            found = False
        if float(result[3]) != float(data['gpu_memory_usage']):
            found = False
        if result[4] != data['gpumetric_id']:
            found = False
    #    if found == False:
    #        print(result)

    #print("Process MetricFound: " + str(found))
    if found == False:
        #print(data)
        query = (
                "INSERT INTO `processmetrics` (`process_id`, `gpumetric_id`, `gpu_memory_usage`, `cpu_percent`, `cpu_memory_usage`, `query_time`) "
                "VALUES (%(process_id)s, %(gpumetric_id)s, %(gpu_memory_usage)s, %(cpu_percent)s, %(cpu_memory_usage)s, %(query_time)s);"
             )
        result =  mysql_query(db, query, data)
        #print("process metrics insert : " + str(data))
        return(result.lastrowid)
 
    query = (
        "UPDATE `processmetrics` SET `query_time` = %(query_time)s WHERE `id` = %(id)s"
    )
    mysql_query(db, query, {'id': result[0], 'query_time': data['query_time']})

    return(result[0])

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
        return(result.lastrowid)

    result = result.fetchone()
    data['id'] = result[0]
    query = (
        "UPDATE `namespaces` SET `limits_cpu` = %(limits.cpu)s, `limits_memory` = %(limits.memory)s, `limits_nvidia_com_gpu` = %(limits.nvidia.com/gpu)s, `requests_cpu` = %(requests.cpu)s, `requests_memory` = %(requests.memory)s, `requests_nvidia_com_gpu` = %(requests.nvidia.com/gpu)s WHERE `id` = %(id)s"
    )
    mysql_query(db, query, data)

    return(result[0])

def insertNamespaceUsedResourceQuotas(db, data):
    select_data = (
    "SELECT * FROM `namespaceusedresourcequotas` WHERE `namespace_id` = %(namespace_id)s ORDER BY `id` DESC;"
    )
    result = mysql_query(db, select_data, data)

    found = True
    if result.rowcount == 0:
        found = False
    else:
        result = result.fetchone()
#+----+------------+---------------+-----------------------+--------------+-----------------------+--------------+-----------------+-------------------------+#
#| id | limits_cpu | limits_memory | limits_nvidia_com_gpu | namespace_id | query_time            | requests_cpu | requests_memory | requests_nvidia_com_gpu |
#+----+------------+---------------+-----------------------+--------------+-----------------------+--------------+-----------------+-------------------------+
#|  1 |          8 | 8704Mi        |                  NULL |            1 | 03/04/202013:36:28CST |         1020 | 4176Mi          |                       2 |
#+----+------------+---------------+-----------------------+--------------+-----------------------+--------------+-----------------+-------------------------+
        #print(result[6] != data['requests.cpu'])
        print(result)
        print(data)
        if conv2G(result[1]) != conv2G(data['limits.cpu']):
            found = False
        if conv2G(result[2]) != conv2G(data['limits.memory']):
            found = False
        if conv2G(result[3]) != conv2G(data['limits.nvidia.com/gpu']):
            found = False
        if conv2G(result[6]) != conv2G(data['requests.cpu']):
            found = False
        if conv2G(result[7]) != conv2G(data['requests.memory']):
            found = False
        if conv2G(result[8]) != conv2G(data['requests.nvidia.com/gpu']):
                found = False
    #print(data)
    if found == False:
        #print(data)
        query = (
                "INSERT INTO `namespaceusedresourcequotas` (`namespace_id`, `limits_cpu`, `limits_memory`, `limits_nvidia_com_gpu`, `requests_cpu`, `requests_memory`, `requests_nvidia_com_gpu`, `start_time`, `query_time`) "
                "VALUES (%(namespace_id)s, %(limits.cpu)s, %(limits.memory)s, %(limits.nvidia.com/gpu)s, %(requests.cpu)s, %(requests.memory)s, %(requests.nvidia.com/gpu)s, %(query_time)s, %(query_time)s);"
                )
        result =  mysql_query(db, query, data)
        #print("namespaceusedresourcequota  insert : " + str(data))
        return(result.lastrowid)

    query = (
        "UPDATE `namespaceusedresourcequotas` SET `query_time` = %(query_time)s WHERE `id` = %(id)s"
    )
    mysql_query(db, query, {'id': result[0], 'query_time': data['query_time']})

    return(result[0])

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
#    print(data)
    select_podname = (
    "SELECT * FROM `pods` WHERE `name` = %(name)s and `namespace_id` = %(namespace_id)s and `start_time` = %(start_time)s;"
    )
    result = mysql_query(db, select_podname, data)

    if result.rowcount == 0:
        query = (
                "INSERT INTO `pods` (`name`, `start_time`, `namespace_id`, `hostname`, `phase`, `query_time`) "
                "VALUES (%(name)s, %(start_time)s, %(namespace_id)s, %(hostname)s, %(phase)s, %(query_time)s);"
                )
        result =  mysql_query(db, query, data)
        return(result.lastrowid)
    
    result = result.fetchone()
    query = (
         "UPDATE `pods` SET `query_time` = %(query_time)s WHERE `id` = %(id)s"
    )
    mysql_query(db, query, {'id': result[0], 'query_time': data['query_time']})

    return(result[0])

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
    #print(data)
    select_cname = (
    "SELECT * FROM `containers` WHERE `name` = %(name)s and `pod_id` = %(pod_id)s;"
    )
    result = mysql_query(db, select_cname, data)
    if result.rowcount == 0:
        query = (
                "INSERT INTO `containers` (`pod_id`, `name`, `limits_cpu`, `limits_memory`, `limits_nvidia_com_gpu`, `requests_cpu`, `requests_memory`, `requests_nvidia_com_gpu`, `nspid`, `query_time`) "
                "VALUES (%(pod_id)s, %(name)s, %(limits.cpu)s, %(limits.memory)s, %(limits.nvidia.com/gpu)s, %(requests.cpu)s, %(requests.memory)s, %(requests.nvidia.com/gpu)s, %(nspid)s, %(query_time)s);"
                )
        result =  mysql_query(db, query, data)
        return(result.lastrowid)

    result = result.fetchone()
    query = (
         "UPDATE `containers` SET `query_time` = %(query_time)s WHERE `id` = %(id)s"
    )
    mysql_query(db, query, {'id': result[0], 'query_time': data['query_time']})

    return(result[0])

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
    #print(data)
    select_cgname = (
    "SELECT * FROM `containergpus` WHERE `container_id` = %(container_id)s and `gpu_id` = %(gpu_id)s or `gpu_id` = 0;"
    )
    result = mysql_query(db, select_cgname, data)

    if result.rowcount == 0:
        query = (
                "INSERT INTO `containergpus` (`pod_id`, `container_id`, `nspid`, `gpu_id`, `namespace_id`) "
                "VALUES (%(pod_id)s, %(container_id)s, %(nspid)s, %(gpu_id)s, %(namespace_id)s);"
                )
        #print(data)
        result =  mysql_query(db, query, data)
        return(result.lastrowid)

    result = result.fetchone()
    query = (
            "UPDATE `containergpus` SET `gpu_id` = %(gpu_id)s, `namespace_id` = %(namespace_id)s WHERE `id` = %(id)s"
            )
    mysql_query(db, query, {'id': result[0], 'gpu_id': data['gpu_id'], 'namespace_id': data['namespace_id']})
    return(result[0])

def checkifexist(db, table, data):
    #print(data)
    select_querytime = (
    "SELECT * FROM `" + table + "` WHERE `query_time` = %(query_time)s;"
    )
    result = mysql_query(db, select_querytime, data)
    return(result.rowcount != 0)

def processGpuMetrics(*args):
    gpu = args[0]
    connection =  MySQLdb.connect(
            host = mysql_db_host,
            user = mysql_db_user,
            passwd = mysql_db_password,
            db ='computemetrics'
        )

    #print('gpu uuid:', gpu['uuid'])
    gpu_id = 0
    gpumetric_id = 0

    try:
        gpu_id = get_gpu_id(connection, {'uuid': gpu['uuid']})
        gpumetric_id = insertGpuMetric(connection, {
                    'gpu_id': gpu_id, \
                    'temperature.gpu': gpu['temperature.gpu'], \
                    'utilization.gpu': gpu['utilization.gpu'], \
                    'power.draw': gpu['power.draw'], \
                    'memory.used': gpu['memory.used'], \
                    'query_time': gpu['query_time']
                    })

        curr_gpumetric_id = insertCurrentGpuMetric(connection, {
                    'gpu_id': gpu_id, \
                    'temperature.gpu': gpu['temperature.gpu'], \
                    'utilization.gpu': gpu['utilization.gpu'], \
                    'power.draw': gpu['power.draw'], \
                    'memory.used': gpu['memory.used'], \
                    'query_time': gpu['query_time']
                    })

    except MySQLdb.Error:
        print(MySQLdb.Error)

    #print(gpu_id)
#    used = 0
#    if len(gpu['processes']) > 0:
#        used = 1
#    insertGpuInfo(connection, {'id': gpu_id, 'used': used}, True)

#    if args[2] == 'gpu_used_status':
#        connection.cursor().close()
#        connection.close()
#        print("gpu {} status is {}".format(gpu_id, used))
#        return
	#print(gpumetric_id)
    for process in gpu['processes']:
        #process = json.loads(process)
        # gpu processes are all started after container created. so it should belong to a container.
        container_id = get_container_id(connection, {
            'gpu_id': gpu_id, \
            'nspid': process['nspid']
        })

        if container_id == None:
            break;
       #print(container_id)
        try:
            process_id = insertProcessInfo(connection, {
			    'pid': process['pid'], \
			    'nspid': process['nspid'], \
			    'container_id': container_id, \
			    'command': process['command'], \
			    'full_command': str(process['full_command']), \
			    'start_time': process['start_time'],
			    'query_time': gpu['query_time']
			})
	   #print(process_id)
            metric_id = insertProcessMetric(connection, {
			    'process_id': process_id, \
			    'gpumetric_id': gpumetric_id, \
			    'gpu_memory_usage': process['gpu_memory_usage'], \
			    'cpu_percent': process['cpu_percent'], \
			    'cpu_memory_usage': str(process['cpu_memory_usage']), \
			    'query_time': gpu['query_time']
			})

        except MySQLdb.Error:
            print(MySQLdb.Error)

    connection.cursor().close()
    connection.close()

class Consumer(mp.Process):
    pending_threads = []
    start_threads = []
    threads_count = 0
    def __init__(self, topic, group_id):
        mp.Process.__init__(self)
        self.stop_event = mp.Event()
        self.topic = topic
        self.group_id = group_id
        self.mypartition = TopicPartition(self.topic, 0)
        self.connection = MySQLdb.connect(
            host = mysql_db_host,
            user = mysql_db_user,
            passwd = mysql_db_password,
            db ='computemetrics'
        )
        self.gpu_info_cur = {}
        self.gpu_info_pre = {}
        
    def stop(self):
        self.stop_event.set()

    def processMessage(self, message):
        #print(type(message.value))
        if self.topic == 'gpu_metrics':
            if type(message.value) == bytes:
               jsonmsg = json.loads(message.value)
               print(jsonmsg['query_time'])
               #print(type(jsonmsg))
               #if type(jsonmsg) == str:
               #   jsonmsg = json.loads(jsonmsg)
               #if checkifexist(self.connection, 'gpumetrics', {'query_time': jsonmsg['query_time']}):
               #    return

               #threads = []
               for gpu in jsonmsg['gpus']:
                    gpu['query_time'] =  jsonmsg['query_time']
                    gpu['hostname'] = jsonmsg['hostname']
#                    print(gpu)
                    if self.group_id == 'gpu_used_status':
                        gpu_id = get_gpu_id(self.connection, {'uuid': gpu['uuid']})

                        used = 0
                        if len(gpu['processes']) > 0:
                            used = 1

                        insertGpuInfo(self.connection, {'id': gpu_id, 'used': used}, True)
#                        print('insert gpu metrics')
                        curr_gpumetric_id = insertCurrentGpuMetric(self.connection, {
                                'gpu_id': gpu_id, \
                                'temperature.gpu': gpu['temperature.gpu'], \
                                'utilization.gpu': gpu['utilization.gpu'], \
                                'power.draw': gpu['power.draw'], \
                                'memory.used': gpu['memory.used'], \
                                'query_time': gpu['query_time']
                        })
                        print("gpu {} status is {}".format(gpu_id, used))
                    #else:
                    #    t = threading.Thread(target=processGpuMetrics, args=(gpu, self.connection, ))
                    #    t.start()

            return ''

        if self.topic == 'namespace_metrics':
           #if len(self.gpu_info_pre) == 0:
           self.gpu_info_pre = get_gpu_info_db(self.connection, None, 0)

           jsonmsg_all = json.loads(message.value)
           #print(jsonmsg_all)
#{'query_time':'03/03/202009:59:15CST','owner':'admin@kubeflow.org','namespace':'admin','compute-quota':{'hard':{'limits.cpu':'8','limits.memory':'16Gi','limits.nvidia.com/gpu':'2','requests.cpu':'8','requests.memory':'16Gi','requests.nvidia.com/gpu':'2'},'used':{'limits.cpu':'2','limits.memory':'256Mi','requests.cpu':'510m','requests.memory':'1064Mi','requests.nvidia.com/gpu':'2'}},'pods':[{'name':'tf-test-0','start_time':'02/24/202002:32:18UTC','phase':'Running','hostname':'gpu01','containers':[{'name':'tf-test','resources':{'limits':{'nvidia.com/gpu':'2'},'requests':{'cpu':'500m','memory':'1Gi','nvidia.com/gpu':'2'}},'gpu_uuid':['GPU-ab4510fc-c378-5bf5-615e-3bd8a3e141a2','GPU-ee309bde-fc38-b3ea-b5dc-afc17d0d44e1'],'nspid':4026535186},{'name':'istio-proxy','resources':{'limits':{'cpu':'2','memory':'256Mi'},'requests':{'cpu':'10m','memory':'40Mi'}},'nspid':4026535189}]}]}
            #if checkifexist(self.connection, 'namespaceusedresourcequotas', {'query_time': jsonmsg['query_time']}):
            #       return
            #print(jsonmsg)
           for jsonmsg in jsonmsg_all:

            if jsonmsg.get('compute-quota') != None:
                if jsonmsg['compute-quota']['hard'].get('limits.cpu') == None:
                    jsonmsg['compute-quota']['hard']['limits.cpu'] = None
                if jsonmsg['compute-quota']['hard'].get('limits.memory') == None:
                    jsonmsg['compute-quota']['hard']['limits.memory'] = None
                if jsonmsg['compute-quota']['hard'].get('limits.nvidia.com/gpu') == None:
                    jsonmsg['compute-quota']['hard']['limits.nvidia.com/gpu'] = None
                if jsonmsg['compute-quota']['hard'].get('requests.cpu') == None:
                    jsonmsg['compute-quota']['hard']['requests.cpu'] = None
                if jsonmsg['compute-quota']['hard'].get('requests.memory') == None:
                    jsonmsg['compute-quota']['hard']['requests.memory'] = None
                if jsonmsg['compute-quota']['hard'].get('requests.nvidia.com/gpu') == None:
                    jsonmsg['compute-quota']['hard']['requests.nvidia.com/gpu'] = None
            else:
                jsonmsg['compute-quota'] = {}
                jsonmsg['compute-quota']['hard'] = {}
                jsonmsg['compute-quota']['hard']['limits.cpu'] = None
                jsonmsg['compute-quota']['hard']['limits.memory'] = None
                jsonmsg['compute-quota']['hard']['limits.nvidia.com/gpu'] = None
                jsonmsg['compute-quota']['hard']['requests.cpu'] = None
                jsonmsg['compute-quota']['hard']['requests.memory'] = None
                jsonmsg['compute-quota']['hard']['requests.nvidia.com/gpu'] = None

            namespace_id = insertNamespaceInfo(self.connection, {
                                                'name': jsonmsg['namespace'], \
                                                'owner': jsonmsg['owner'], \
                                                'limits.cpu': jsonmsg['compute-quota']['hard']['limits.cpu'], \
                                                'limits.memory': jsonmsg['compute-quota']['hard']['limits.memory'], \
                                                'limits.nvidia.com/gpu': jsonmsg['compute-quota']['hard']['limits.nvidia.com/gpu'], \
                                                'requests.cpu': jsonmsg['compute-quota']['hard']['requests.cpu'], \
                                                'requests.memory': jsonmsg['compute-quota']['hard']['requests.memory'], \
                                                'requests.nvidia.com/gpu': jsonmsg['compute-quota']['hard']['requests.nvidia.com/gpu'] \
                                               })

            needGetFromContainer = False
            if jsonmsg.get('compute-quota') != None:
                if jsonmsg['compute-quota'].get('used') != None:
                    if jsonmsg['compute-quota']['used'].get('limits.cpu') == None:
                        jsonmsg['compute-quota']['used']['limits.cpu'] = None
                    if jsonmsg['compute-quota']['used'].get('limits.memory') == None:
                        jsonmsg['compute-quota']['used']['limits.memory'] = None
                    if jsonmsg['compute-quota']['used'].get('limits.nvidia.com/gpu') == None:
                        jsonmsg['compute-quota']['used']['limits.nvidia.com/gpu'] = None
                    if jsonmsg['compute-quota']['used'].get('requests.cpu') == None:
                        jsonmsg['compute-quota']['used']['requests.cpu'] = None
                    if jsonmsg['compute-quota']['used'].get('requests.memory') == None:
                        jsonmsg['compute-quota']['used']['requests.memory'] = None
                    if jsonmsg['compute-quota']['used'].get('requests.nvidia.com/gpu') == None:
                        jsonmsg['compute-quota']['used']['requests.nvidia.com/gpu'] = None
                    namespaceusedrq_id = insertNamespaceUsedResourceQuotas(self.connection, {
                                                'namespace_id': namespace_id, \
                                                'limits.cpu': jsonmsg['compute-quota']['used']['limits.cpu'], \
                                                'limits.memory': jsonmsg['compute-quota']['used']['limits.memory'], \
                                                'limits.nvidia.com/gpu': jsonmsg['compute-quota']['used']['limits.nvidia.com/gpu'], \
                                                'requests.cpu': jsonmsg['compute-quota']['used']['requests.cpu'], \
                                                'requests.memory': jsonmsg['compute-quota']['used']['requests.memory'], \
                                                'requests.nvidia.com/gpu': jsonmsg['compute-quota']['used']['requests.nvidia.com/gpu'], \
                                                'query_time': jsonmsg['query_time']
                                                })
                else:
                    needGetFromContainer = True
                    jsonmsg['compute-quota']['used'] = {}
                    jsonmsg['compute-quota']['used']['limits.cpu'] = 0
                    jsonmsg['compute-quota']['used']['limits.memory'] = 0
                    jsonmsg['compute-quota']['used']['limits.nvidia.com/gpu'] = 0
                    jsonmsg['compute-quota']['used']['requests.cpu'] = 0
                    jsonmsg['compute-quota']['used']['requests.memory'] = 0
                    jsonmsg['compute-quota']['used']['requests.nvidia.com/gpu'] = 0

            if jsonmsg.get('pods') != None:
                for pod in jsonmsg['pods']:
                    pod_id = insertPodInfo(self.connection, {
                                                'name': pod['name'], \
                                                'start_time': pod['start_time'], \
                                                'namespace_id': namespace_id, \
                                                'hostname': pod['hostname'], \
                                                'phase': pod['phase'], \
                                                'query_time': jsonmsg['query_time']
                                               })

                    for container in pod['containers']:
                        if container['resources'].get('limits') != None:
                            if container['resources']['limits'].get('cpu') == None:
                                container['resources']['limits']['cpu'] = 0
                            if container['resources']['limits'].get('memory') == None:
                                container['resources']['limits']['memory'] = 0
                            if container['resources']['limits'].get('nvidia.com/gpu') == None:
                                container['resources']['limits']['nvidia.com/gpu'] = 0
                        else:
                            container['resources']['limits'] = {'cpu': 0, 'memory': 0, 'nvidia.com/gpu': 0}
                            #continue
                            #container['resources']['limits']['cpu'] = None
                            #container['resources']['limits']['memory'] = None
                            #container['resources']['limits']['nvidia.com/gpu'] = None

                        if container['resources'].get('requests') != None:
                            if container['resources']['requests'].get('cpu') == None:
                                container['resources']['requests']['cpu'] = 0
                            if container['resources']['requests'].get('memory') == None:
                                container['resources']['requests']['memory'] = 0
                            if container['resources']['requests'].get('nvidia.com/gpu') == None:
                                container['resources']['requests']['nvidia.com/gpu'] = 0
                        else:
                            container['resources']['requests'] = {'cpu': 0, 'memory': 0, 'nvidia.com/gpu': 0}
                            #continue
                            #container['resources']['requests']['cpu'] = None
                            #container['resources']['requests']['memory'] = None
                            #container['resources']['requests']['nvidia.com/gpu'] = None
                        
                        if needGetFromContainer:
                            print(container)
                            jsonmsg['compute-quota']['used']['limits.cpu'] += conv2G(container['resources']['limits']['cpu'])
                            jsonmsg['compute-quota']['used']['limits.memory'] += conv2G(container['resources']['limits']['memory'])
                            jsonmsg['compute-quota']['used']['limits.nvidia.com/gpu'] += conv2G(container['resources']['limits']['nvidia.com/gpu'])
                            jsonmsg['compute-quota']['used']['requests.cpu'] += conv2G(container['resources']['requests']['cpu'])
                            jsonmsg['compute-quota']['used']['requests.memory'] +=  conv2G(container['resources']['requests']['memory'])
                            jsonmsg['compute-quota']['used']['requests.nvidia.com/gpu'] += conv2G(container['resources']['requests']['nvidia.com/gpu'])

                        container_id = insertContainerInfo(self.connection, {
                                                'pod_id': pod_id, \
                                                'name': container['name'], \
                                                'limits.cpu': container['resources']['limits']['cpu'], \
                                                'limits.memory': container['resources']['limits']['memory'], \
                                                'limits.nvidia.com/gpu': container['resources']['limits']['nvidia.com/gpu'], \
                                                'requests.cpu': container['resources']['requests']['cpu'], \
                                                'requests.memory': container['resources']['requests']['memory'], \
                                                'requests.nvidia.com/gpu': container['resources']['requests']['nvidia.com/gpu'], \
                                                'nspid': container['nspid'], \
                                                'query_time': jsonmsg['query_time']
                                               })
                        if container.get('gpu_uuid') != None:
                            for gpu_uuid in container['gpu_uuid']:
                                #print(gpu_uuid)
                                gpu_id = get_gpu_id(self.connection, {'uuid': gpu_uuid})

                                insertContainerGpus(self.connection, {
                                                'pod_id': pod_id, \
                                                'container_id': container_id, \
                                                'gpu_id': gpu_id, \
                                                'nspid': container['nspid'], \
                                                'namespace_id': namespace_id
                                               })

                                if self.gpu_info_cur.get(gpu_id) == None:
                                    self.gpu_info_cur[gpu_id] = namespace_id

            if needGetFromContainer:
                namespaceusedrq_id = insertNamespaceUsedResourceQuotas(self.connection, {
                                                'namespace_id': namespace_id, \
                                                'limits.cpu': jsonmsg['compute-quota']['used']['limits.cpu'], \
                                                'limits.memory': jsonmsg['compute-quota']['used']['limits.memory'], \
                                                'limits.nvidia.com/gpu': jsonmsg['compute-quota']['used']['limits.nvidia.com/gpu'], \
                                                'requests.cpu': jsonmsg['compute-quota']['used']['requests.cpu'], \
                                                'requests.memory': jsonmsg['compute-quota']['used']['requests.memory'], \
                                                'requests.nvidia.com/gpu': jsonmsg['compute-quota']['used']['requests.nvidia.com/gpu'], \
                                                'query_time': jsonmsg['query_time']
                                                })
        return self.topic

    def processGpuStatus(self, hostname):
        print(self.topic)
        set_add = set()
        set_del = set()
        if self.topic == 'namespace_metrics':
            #print(self.gpu_info_cur)
            set_cur = set(self.gpu_info_cur.items())
            print("set_cur", set_cur)

            set_pre = set(self.gpu_info_pre.items())
            print("set_pre", set_pre)

            set_add = set_cur - set_pre
            set_del = set_pre - set_cur
            print("add ", set_add)
            print("del ", set_del)

            #self.gpu_info_pre = self.gpu_info_cur
            #print("pre", self.gpu_info_pre)
            self.gpu_info_cur = {}

            for v in set_add:
                insertGpuInfo(self.connection, {'id': v[0], 'user': v[1]}, True)
            for v in set_del:
                insertGpuInfo(self.connection, {'id': v[0], 'user': None}, True)

    def run(self):
        consumer = KafkaConsumer(bootstrap_servers=kafka_broker+':9092',
                                 #auto_offset_reset='earliest',
                                 group_id = self.group_id,
                                 enable_auto_commit = False,
                                 consumer_timeout_ms = 100)
        consumer.subscribe([self.topic])

        try:
            while not self.stop_event.is_set():
                for message in consumer:
                    topic = self.processMessage(message)
                    #if self.topic == 'namespace_metrics':
                    self.processGpuStatus(topic)
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
        Consumer(topic = "namespace_metrics", group_id = "namespace_metrics"),
        #Consumer(topic = "gpu_metrics", group_id = "gpu_metrics"),
        Consumer(topic = "gpu_metrics", group_id = "gpu_used_status")
    ]

    for t in tasks:
        t.start()
        time.sleep(2)

    #for t in tasks:
    #    t.join()

    #time.sleep(10)
    
    #for task in tasks:
    #    task.stop()

    #for task in tasks:
    #    task.join()
        
        
if __name__ == "__main__":
    logging.basicConfig(
        format='%(asctime)s.%(msecs)s:%(name)s:%(thread)d:%(levelname)s:%(process)d:%(message)s',
        level=logging.INFO
        )
    main()
