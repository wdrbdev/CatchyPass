# Pull images from docker hub
docker pull registry.hub.docker.com/library/mongo:latest
docker pull tensorflow/tensorflow:latest-jupyter
docker pull node:alpine
docker pull redis:latest
docker pull nginx:latest

# Save images as file
docker save -o ./repo/mongo.tar registry.hub.docker.com/library/mongo:latest
docker save -o ./repo/tensorflow.tar tensorflow/tensorflow:latest-jupyter
docker save -o ./repo/node.tar node:alpine
docker save -o ./repo/redis.tar redis:latest
docker save -o ./repo/nginx.tar nginx:latest