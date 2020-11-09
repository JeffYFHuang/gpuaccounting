# use basic syntax for now
FROM gcr.io/kubeflow-images-public/tensorflow-2.0.0a0-notebook-gpu:v0.7.0

USER root

ENV DEBIAN_FRONTEND noninteractive

ENV NB_USER jovyan
ENV NB_UID 1000
ENV HOME /home/$NB_USER
ENV NCCL_SOCKET_IFNAME lo
COPY test /
# We prefer to have a global conda install
# to minimize the amount of content in $HOME
#ENV GRANT_SUDO yes
#ENV LD_LIBRARY_PATH /usr/local/cuda/extras/CUPTI/lib64:/usr/local/cuda/lib64:/usr/local/nvidia/lib:/usr/local/nvidia/lib64
#ENV PATH /usr/local/nvidia/bin:/usr/local/cuda/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Use bash instead of sh
SHELL ["/bin/bash", "-c"]

# Configure container startup
EXPOSE 8888
USER root
ENTRYPOINT ["tini", "--"]
CMD ["bash","-c", "jupyter notebook --notebook-dir=/home/jovyan --ip=0.0.0.0 --no-browser --allow-root --port=8888 --NotebookApp.token='' --NotebookApp.password='' --NotebookApp.allow_origin='*' --NotebookApp.base_url=${NB_PREFIX}"]
