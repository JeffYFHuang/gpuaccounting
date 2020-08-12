#!/bin/bash

# sample value for your variables
namespace=$1
requests_cpu=$2
requests_memory=$3
requests_gpu=$4
limits_cpu=$5
limits_memory=$6
limits_gpu=$7

# read the yml template from a file and substitute the string 
# {{MYVARNAME}} with the value of the MYVARVALUE variable
template=`cat "resourcequota.yaml.template" | sed "s/{namespace}/$namespace/g"`
template="${template/\{requests\.cpu\}/$requests_cpu}"
template="${template/\{requests\.memory\}/$requests_memory}"
template="${template/\{requests\.gpu\}/$requests_gpu}"
template="${template/\{limits\.cpu\}/$limits_cpu}"
template="${template/\{limits\.memory\}/$limits_memory}"
template="${template/\{limits\.gpu\}/$limits_gpu}"
#echo $template

# apply the yml with the substituted value
echo "$template" | kubectl apply -f -
