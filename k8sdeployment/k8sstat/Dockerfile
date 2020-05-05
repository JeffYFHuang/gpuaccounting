FROM python:3.6
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY python /opt/app
COPY run.sh /opt/app
RUN mkdir -p /root/.kube && \
    chmod 0700 /root/.kube
ADD .kube/config /root/.kube/

#RUN apt-get update
RUN apt-get install libyaml-dev
RUN pip install kafka-python
RUN pip install requests
RUN pip install tzlocal
RUN cd /opt/app && python3 setup.py install
WORKDIR /opt/app
ENV KAFKA_BROKER=10.35.65.28
#RUN pip install -r requirements.txt

ENTRYPOINT ["/bin/sh", "/opt/app/run.sh"]
