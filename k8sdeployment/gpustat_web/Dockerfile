FROM python:3.6
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY gpustat-console /opt/gpustat-console
COPY run.sh /opt
RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh
ADD .ssh/id_rsa /root/.ssh/
ADD .ssh/id_rsa.pub /root/.ssh/
RUN ssh -oStrictHostKeyChecking=no 10.36.48.130
RUN ssh -oStrictHostKeyChecking=no 10.36.48.131

RUN apt-get update
RUN apt-get install default-libmysqlclient-dev
RUN pip3 install kafka-python
RUN pip3 install mysqlclient
RUN cd /opt/gpustat-console && python3 setup.py install
#COPY kafka_consumer/gpu_info_insert.py /opt
#COPY kafka_consumer/metrics_consumer.py /opt
WORKDIR /opt
#RUN pip install -r requirements.txt

ENTRYPOINT ["/bin/sh", "/opt/run.sh"]
