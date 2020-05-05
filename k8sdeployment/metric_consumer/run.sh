#!/bin/bash
# do other things here

# kafka service ip
echo "10.35.65.28 deepops-desktop" >> /etc/hosts
python3 gpu_info_insert.py
python3 metrics_consumer.py 2>&1
