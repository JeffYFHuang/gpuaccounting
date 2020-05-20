FROM python:3.6
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY run.sh /opt

RUN apt-get update
RUN apt-get install default-libmysqlclient-dev
RUN pip3 install kafka-python
RUN pip3 install mysqlclient
COPY kafka_consumer/gpu_info_insert.py /opt
COPY kafka_consumer/metrics_consumer.py /opt
WORKDIR /opt
#RUN pip install -r requirements.txt

ENTRYPOINT ["/bin/sh", "/opt/run.sh"]
