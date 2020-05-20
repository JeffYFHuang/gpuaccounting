from kubernetes import client, config
from kubernetes.client import configuration
from kubernetes.stream import stream

# create an instance of the API class

config.load_kube_config()
#configuration.assert_hostname = False
api_instance = client.CoreV1Api()

exec_command = [
    '/bin/bash',
    '-c',
    'nvidia-smi -a']
resp = stream(api_instance.connect_get_namespaced_pod_exec, 'nginx-ingress-controller-d845db6b8-fzbdm', 'default',
              command=exec_command,
              stderr=True, stdin=False,
              stdout=True, tty=False)
print("Response: " + resp)
