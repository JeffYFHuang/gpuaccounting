#!/bin/bash
# do other things here

# kafka service ip
#echo "10.35.65.28 deepops-desktop" >> /etc/hosts
#python3 gpu_info_insert.py
#python3 metrics_consumer.py &
python3 -m gpustat_web --port 5555 --interval 20 --exec "gpustat --json" 127.0.0.1 2>&1
