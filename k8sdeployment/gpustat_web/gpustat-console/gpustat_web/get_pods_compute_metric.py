import calendar; import time
from datetime import datetime
from tzlocal import get_localzone

from kubernetes import client, config
from kubernetes.client import Configuration
from kubernetes.client.api import core_v1_api
from kubernetes.client.rest import ApiException
from kubernetes.stream import stream

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
ret = core_v1.list_pod_for_all_namespaces(watch=False)
exec_command = [
        'bash',
        '-c',
        '/usr/bin/nvidia-smi -a | grep UUID']
local = get_localzone()
ts = calendar.timegm(time.localtime())
for i in ret.items:
    #print(i.status)
    #print("%s\t%s\t%s\t%s" % (i.status.phase, i.status.start_time, i.metadata.namespace, i.metadata.name))
    for j in i.spec.containers:
        if j.resources.requests != None and j.resources.requests.get('nvidia.com/gpu', None) != None:
               cpu = j.resources.requests.get('cpu', 0)
               memory = j.resources.requests.get('memory', 0)
               gpu = j.resources.requests.get('nvidia.com/gpu', 0)
               resp = stream(core_v1.connect_get_namespaced_pod_exec,
               i.metadata.name,
               i.metadata.namespace,
               container=j.name,
               command=exec_command,
               stderr=True, stdin=False,
               stdout=True, tty=False)
               resp = resp.replace(" ", "").replace("\n","").split('GPUUUID:')
               resp = [item for item in resp if item != '']
               print("{'namespace': '%s', 'podname': '%s', 'start_time':'%s', 'lastupdate_time': %s, 'phase': '%s', 'cpu': '%s', 'memory': '%s', 'nvidia.com/gpu': %s,'uuid': %s}" % (i.metadata.namespace, i.metadata.name, i.status.start_time, datetime.now(local), i.status.phase, cpu, memory, gpu, resp))
        # 'resources': {'limits': {u'cpu': '2',
        #                  u'memory': '8Gi',
        #                  u'nvidia.com/gpu': '2'},
        #       'requests': {u'cpu': '2',
        #                    u'memory': '8Gi',
        #                    u'nvidia.com/gpu': '2'}},
