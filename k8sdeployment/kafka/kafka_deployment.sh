helm repo add bitnami https://charts.bitnami.com/bitnami
helm install -n zookeeper bitnami/zookeeper --set replicaCount=3 --set auth.enabled=false --set allowAnonymousLogin=true
helm install kafka bitnami/kafka --set zookeeper.enabled=false --set replicaCount=3 --set externalZookeeper.servers=zookeeper.default.svc.cluster.local

# Test Apache Kafka
# Create a topic named mytopic using the commands below.
export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=kafka,app.kubernetes.io/instance=kafka,app.kubernetes.io/component=kafka" -o jsonpath="{.items[0].metadata.name}")

kubectl --namespace default exec -it $POD_NAME -- kafka-topics.sh --create --zookeeper zookeeper.default.svc.cluster.local:2181 --replication-factor 1 --partitions 1 --topic mytopic

# Start a Kafka message consumer. 
kubectl --namespace default exec -it $POD_NAME -- kafka-console-consumer.sh --bootstrap-server kafka.default.svc.cluster.local:9092 --topic mytopic --consumer.config /opt/bitnami/kafka/config/consumer.properties &

#Using a different console, start a Kafka message producer and produce some messages by running the command below
kubectl --namespace default exec -it $POD_NAME -- kafka-console-producer.sh --broker-list kafka.default.svc.cluster.local:9092 --topic mytopic --producer.config /opt/bitnami/kafka/config/producer.properties
