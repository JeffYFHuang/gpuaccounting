from pprint import pprint

from kubernetes import client, config
from kubernetes.client import CoreV1Api
from kubernetes.stream import stream
from kubernetes.client import configuration

# create an instance of the API class

config.load_kube_config()
configuration.assert_hostname = False

exec_command = [
    '/bin/sh',
    '-c',
    'echo This message goes to stdout; ls / -alh'
]

api = CoreV1Api()
api_response = stream(api.connect_get_namespaced_pod_exec,
                      'tf-test-0',
                      'jeffyfhuang',
                      command=exec_command,
                      stderr=True,
                      stdin=False,
                      stdout=True,
                      tty=False,
                      _preload_content=True)

pprint(api_response)
