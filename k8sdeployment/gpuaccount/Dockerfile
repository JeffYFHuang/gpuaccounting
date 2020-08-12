FROM ubuntu:18.04
RUN apt-get update
RUN apt-get install -y openjdk-8-jdk
#RUN apt-get -y install software-properties-common
#RUN add-apt-repository -y ppa:webupd8team/java
#RUN echo debconf shared/accepted-oracle-license-v1-1 select true | debconf-set-selections
#RUN echo debconf shared/accepted-oracle-license-v1-1 seen true | debconf-set-selections
#RUN apt-get update
#RUN apt install -y oracle-java8-set-default
#RUN apt-get -y install oracle-java8-installer
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY spring-boot-data-jpa-0.0.1-SNAPSHOT.jar /opt/app.jar
COPY run.sh /opt/run.sh
RUN chmod +x /opt/run.sh
COPY set_resourcequota.sh /opt
COPY resourcequota.yaml.template /opt
RUN mkdir -p /root/.kube && \
    chmod 0700 /root/.kube
ADD .kube/config /root/.kube/
ADD ./kubectl /usr/local/bin/kubectl
RUN chmod +x /usr/local/bin/kubectl
WORKDIR /opt

EXPOSE 9090
USER root
ENV TINI_VERSION v0.17.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /usr/local/bin/tini
RUN chmod +x /usr/local/bin/tini
ENTRYPOINT ["/usr/local/bin/tini", "--"]
CMD ["/bin/sh", "-c", "/opt/run.sh"]
#ENTRYPOINT ["/bin/sh", "/opt/run.sh"]
