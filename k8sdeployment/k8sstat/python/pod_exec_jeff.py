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
    'nvidia-smi -a | grep UUID']
resp = stream(api_instance.connect_get_namespaced_pod_exec, 'tf-test-0', 'jeffyfhuang',
              container='tf-test',
              command=exec_command,
              stderr=True, stdin=False,
              stdout=True, tty=False)
print(resp)
