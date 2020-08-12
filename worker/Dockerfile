FROM tensorflow/tensorflow:latest-jupyter
WORKDIR '/catchypass'
COPY . .

# Install Git LFS to download model
RUN url -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
RUN apt-get install git-lfs
RUN git lfs install
RUN git clone https://github.com/lightcoker/CatchyPass.git
RUN cp -r CatchyPass/worker/data .

EXPOSE 8888

RUN /usr/bin/python3 -m pip install --upgrade pip && \
  pip install -r requirements.txt

# Enable dark theme
RUN jt -t onedork -T -N -kl -fs 14

# Install Jupyter Notebook extensions
RUN jupyter contrib nbextension install --system
RUN jupyter nbextension enable code_prettify/code_prettify
RUN jupyter nbextension enable hinterland/hinterland
RUN jupyter nbextension enable varInspector/main
RUN jupyter nbextension enable execute_time/ExecuteTime
RUN jupyter nbextension enable autosavetime/main