# use basic syntax for now
FROM tensorflow/tensorflow:latest-gpu-py3
MAINTAINER jeff

## 安裝 ##
RUN apt-get update
RUN apt-get install -y libsm6 libxext6 libxrender-dev
RUN apt-get install nano
# librosa dependence
RUN apt-get install -y libsndfile1
RUN apt-get update

## python package ##
RUN pip3 install opencv-python
RUN pip3 install -U scikit-learn
RUN pip3 install pillow
RUN pip3 install matplotlib
RUN pip3 install librosa==0.7.0
RUN pip3 install torch==1.5.0+cu101 torchvision==0.6.0+cu101 -f https://download.pytorch.org/whl/torch_stable.html
RUN pip3 install unidecode
RUN pip3 install inflect
RUN pip3 install numba==0.48.0
RUN pip3 install jupyter

USER root

ENV DEBIAN_FRONTEND noninteractive

ENV NB_USER jovyan
ENV NB_UID 1000
ENV HOME /home/$NB_USER
ENV NCCL_SOCKET_IFNAME lo
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
ENV TINI_VERSION v0.17.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /usr/local/bin/tini
RUN chmod +x /usr/local/bin/tini
ENTRYPOINT ["tini", "--"]
CMD ["bash","-c", "jupyter notebook --notebook-dir=/home/jovyan --ip=0.0.0.0 --no-browser --allow-root --port=8888 --NotebookApp.token='' --NotebookApp.password='' --NotebookApp.allow_origin='*' --NotebookApp.base_url=${NB_PREFIX}"]
