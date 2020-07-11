# eval $(minikube docker-env)
docker load -i ./repo/mongo.tar
docker load -i ./repo/tensorflow.tar
docker load -i ./repo/node.tar
docker load -i ./repo/redis.tar
docker load -i ./repo/nginx.tar
