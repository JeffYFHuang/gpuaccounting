import calendar; import time
from datetime import datetime
from tzlocal import get_localzone

from kubernetes import client, config
from kubernetes.client import Configuration
from kubernetes.client.api import core_v1_api
from kubernetes.client.rest import ApiException
from kubernetes.stream import stream
import re

import json
from kafka import KafkaProducer
#data = "2019-10-22T00:00:00.000-05:00"
#result1 = datetime.strptime(data[0:19],"%Y-%m-%dT%H:%M:%S")
#result2 = datetime.strptime(data[0:23],"%Y-%m-%dT%H:%M:%S.%f")
#result3 = datetime.strptime(data[0:9], "%Y-%m-%d")

#print(result1)
# Configs can be set in Configuration class directly or using helper utility
config.load_kube_config()

v1 = client.CoreV1Api()
config.load_kube_config()
c = Configuration()
c.assert_hostname = False
Configuration.set_default(c)
core_v1 = core_v1_api.CoreV1Api()
#print("Listing pods with their IPs:")
exec_command_gpuuuid = [
        'bash',
        '-c',
        '/usr/bin/nvidia-smi -a | grep UUID']
exec_command_nspid = [
        'bash',
        '-c',
        'readlink /proc/*/task/*/ns/* | sort -u | grep pid']
local = get_localzone()
ts = calendar.timegm(time.localtime())

def get_gpu_uuid(i, j):
    try:
        resp = stream(core_v1.connect_get_namespaced_pod_exec,
               i.metadata.name,
               i.metadata.namespace,
               container=j.name,
               command=exec_command_gpuuuid,
               stderr=True, stdin=False,
               stdout=True, tty=False)
        resp = resp.replace(" ", "").replace("\n","").split('GPUUUID:')
        resp = ([item for item in resp if item != ''])
    except ApiException as e:
        #if e.status != 404:
        #    print("Unknown error: %s" % e)
        resp = None

    return resp

def get_pod_nspid(i, j):
    try:
        resp = stream(core_v1.connect_get_namespaced_pod_exec,
               i.metadata.name,
               i.metadata.namespace,
               container=j.name,
               command=exec_command_nspid,
               stderr=True, stdin=False,
               stdout=True, tty=False)
        resp = ((int)(re.sub(r'[^0-9 ]', "", resp)))
    except ApiException as e:
        #if e.status != 404:
        #    print("Unknown error: %s" % e)
        resp = None
    return resp

def get_gpu_metric(host):
    return resp

def send_message(producer, topic, msg):
    if producer == None:
        producer = KafkaProducer(bootstrap_servers='localhost:9092', value_serializer=lambda v: json.dumps(v).encode('utf-8'))
    producer.send(topic, msg)
    return producer

producer = None
interval = 5
while 1:
   try:
     query_start = time.time()
     ret = core_v1.list_pod_for_all_namespaces(watch=False)
     for i in ret.items:
    #print(i.status)
    #print("%s\t%s\t%s\t%s" % (i.status.phase, i.status.start_time, i.metadata.namespace, i.metadata.name))
    
       for j in i.spec.containers:
           if j.resources.requests != None and j.resources.requests.get('nvidia.com/gpu', None) != None:
               p = {}
               p['namespace'] = i.metadata.namespace
               p['podname'] = i.metadata.name
               p['start_time'] = i.status.start_time.strftime('%m/%d/%Y %H:%M:%S %Z')
               p['query_time'] = datetime.now(local).strftime('%m/%d/%Y %H:%M:%S %Z')
               p['phase'] = i.status.phase
               p['limits.cpu'] = j.resources.requests.get('cpu', 0)
               p['limits.memory'] = j.resources.requests.get('memory', 0)
               p['limitss.nvidia.com/gpu'] = j.resources.requests.get('nvidia.com/gpu', 0)
               p['requests.cpu'] = j.resources.requests.get('cpu', 0)
               p['requests.memory'] = j.resources.requests.get('memory', 0)
               p['requests.nvidia.com/gpu'] = j.resources.requests.get('nvidia.com/gpu', 0)
               p['gpu_uuid'] = get_gpu_uuid(i, j)
               p['nspid'] = get_pod_nspid(i, j)
               print(p['query_time'])
     producer = send_message(producer, 'pod_metrics', p)
     query_duration = time.time() - query_start
     sleep_duration = interval - query_duration
     if sleep_duration > 0:
        time.sleep(sleep_duration)
   except KeyboardInterrupt:
     print("stop!")
     exit(1);
