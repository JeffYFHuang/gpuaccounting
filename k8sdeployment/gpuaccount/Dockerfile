FROM openjdk:8-jdk-alpine
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY gpuaccounting/target/spring-boot-data-jpa-0.0.1-SNAPSHOT.jar /opt/app.jar
COPY run.sh /opt/run.sh

EXPOSE 9090
ENTRYPOINT ["/bin/sh", "/opt/run.sh"]
