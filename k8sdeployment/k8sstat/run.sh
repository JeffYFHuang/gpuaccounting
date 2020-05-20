#!/bin/bash
# do other things here

# kafka service ip
echo "10.35.65.28 deepops-desktop" >> /etc/hosts
python3 kafka_namespace_metric_producer.py 2>&1
