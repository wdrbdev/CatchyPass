# Update the latest version for k8s to update the image
docker build -t lightcoker/catchypass-client:latest -t lightcoker/catchypass-client:$SHA -f ./client/Dockerfile ./client
docker build -t lightcoker/catchypass-server:latest -t lightcoker/catchypass-server:$SHA -f ./server/Dockerfile ./server
docker build -t lightcoker/catchypass-worker:latest -t lightcoker/catchypass-worker:$SHA -f ./worker/Dockerfile ./worker
docker build -t lightcoker/catchypass-mongo:latest -t lightcoker/catchypass-mongo:$SHA -f ./worker/Dockerfile  --build-arg MONGO_INITDB_ROOT_PASSWORD="$MONGO_PASSWORD_PROD" ./mongo
docker build -t lightcoker/catchypass-e2e:latest -t lightcoker/catchypass-e2e:$SHA -f ./worker/Dockerfile ./e2e

# Update the latest version to docker hub
docker push lightcoker/catchypass-client:latest
docker push lightcoker/catchypass-server:latest
docker push lightcoker/catchypass-worker:latest
docker push lightcoker/catchypass-mongo:latest
docker push lightcoker/catchypass-e2e:latest

# Update the latest version to docker hub for k8s to update images in deployment config 
docker push lightcoker/catchypass-client:$SHA
docker push lightcoker/catchypass-server:$SHA
docker push lightcoker/catchypass-worker:$SHA
docker push lightcoker/catchypass-mongo:$SHA
docker push lightcoker/catchypass-e2e:$SHA

# Setup k8s config
kubectl apply -f k8s
kubectl set image deployments/server-deployment node=lightcoker/catchypass-server:$SHA
kubectl set image deployments/worker-deployment python=lightcoker/catchypass-worker:$SHA
kubectl set image deployments/client-deployment react=lightcoker/catchypass-client:$SHA
kubectl set image deployments/mongodb-deployment mongodb=lightcoker/catchypass-mongo:$SHA
kubectl set image jobs/e2e-deployment e2e=lightcoker/mongo-e2e:$SHA
