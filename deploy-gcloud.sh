#!/bin/bash
# Commands to deploy CatchyPass on GCP

# Global settings
PROJECT_ID=<gcp_project_id>
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
COMPUTE_REGION=asia-east1
GKE_CLUSTER_NAME=catchypass-cluster
DOMAIN=catchypass.me

# Change to the project
gcloud config set project $PROJECT_ID

# Setup triggers for Cloud Build
#TODO NOTE: Need to go to the console to map the GitHub repo to this project
exit 1

gcloud beta builds triggers create github \
  --repo-name=CatchyPass \
  --repo-owner=lightcoker \
  --name=test-feature \
  --branch-pattern=^feature$ \
  --build-config=cloudbuild/cloudbuild.test.yaml \
  --substitutions _CLUSTER=$GKE_CLUSTER_NAME,_LOCATION=$COMPUTE_REGION

gcloud beta builds triggers create github \
  --repo-name=CatchyPass \
  --repo-owner=lightcoker \
  --name=staging \
  --branch-pattern=^staging$ \
  --build-config=cloudbuild/cloudbuild.staging.yaml \
  --substitutions _CLUSTER=$GKE_CLUSTER_NAME,_LOCATION=$COMPUTE_REGION

gcloud beta builds triggers create github \
  --repo-name=CatchyPass \
  --repo-owner=lightcoker \
  --name=client \
  --branch-pattern=^master$ \
  --build-config=cloudbuild/deployment/cloudbuild.client.yaml \
  --substitutions _CLUSTER=$GKE_CLUSTER_NAME,_LOCATION=$COMPUTE_REGION

gcloud beta builds triggers create github \
  --repo-name=CatchyPass \
  --repo-owner=lightcoker \
  --name=mongo \
  --branch-pattern=^master$ \
  --build-config=cloudbuild/deployment/cloudbuild.mongo.yaml \
  --substitutions _CLUSTER=$GKE_CLUSTER_NAME,_LOCATION=$COMPUTE_REGION

gcloud beta builds triggers create github \
  --repo-name=CatchyPass \
  --repo-owner=lightcoker \
  --name=redis \
  --branch-pattern=^master$ \
  --build-config=cloudbuild/deployment/cloudbuild.redis.yaml \
  --substitutions _CLUSTER=$GKE_CLUSTER_NAME,_LOCATION=$COMPUTE_REGION

gcloud beta builds triggers create github \
  --repo-name=CatchyPass \
  --repo-owner=lightcoker \
  --name=server \
  --branch-pattern=^master$ \
  --build-config=cloudbuild/deployment/cloudbuild.server.yaml \
  --substitutions _CLUSTER=$GKE_CLUSTER_NAME,_LOCATION=$COMPUTE_REGION

gcloud beta builds triggers create github \
  --repo-name=CatchyPass \
  --repo-owner=lightcoker \
  --name=util \
  --branch-pattern=^master$ \
  --build-config=cloudbuild/cloudbuild.util.yaml \
  --substitutions _CLUSTER=$GKE_CLUSTER_NAME,_LOCATION=$COMPUTE_REGION

gcloud beta builds triggers create github \
  --repo-name=CatchyPass \
  --repo-owner=lightcoker \
  --name=worker \
  --branch-pattern=^master$ \
  --build-config=cloudbuild/deployment/cloudbuild.worker.yaml \
  --substitutions _CLUSTER=$GKE_CLUSTER_NAME,_LOCATION=$COMPUTE_REGION

gcloud beta builds triggers create github \
  --repo-name=CatchyPass \
  --repo-owner=lightcoker \
  --name=service \
  --branch-pattern=^master$ \
  --build-config=cloudbuild/cloudbuild.service.yaml \
  --substitutions _CLUSTER=$GKE_CLUSTER_NAME,_LOCATION=$COMPUTE_REGION

# Reserve static IP
gcloud compute addresses create catchypass-prod \
    --region=$COMPUTE_REGION
REVERSED_STATIC_IP=$(gcloud compute addresses describe catchypass-prod \
    --region=$COMPUTE_REGION \
    --format='value(address)')

# Grant the GKE Admin role to the Cloud Build service account:
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
    --role=roles/container.admin
# Grant the IAM Service Account User role to the Cloud Build service account for the Cloud Run runtime service account:
gcloud iam service-accounts add-iam-policy-binding \
    $PROJECT_NUMBER-compute@developer.gserviceaccount.com \
    --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
    --role=roles/iam.serviceAccountUser

# Cloud DNS
gcloud dns managed-zones create catchypass \
    --description=catchypass \
    --dns-name=$DOMAIN \
    --dnssec-state=on \
    --visibility=public

#TODO Note: Manually add record-set
# https://cloud.google.com/dns/docs/records
exit 1

# Initialize GKE
gcloud config set compute/region $COMPUTE_REGION 
gcloud container clusters create $GKE_CLUSTER_NAME \
    --release-channel=stable \
    --cluster-version=1.16.13-gke.1 \
    --region $COMPUTE_REGION \
    --enable-autoscaling \
    --num-nodes=1 \
    --max-nodes=3 \
    --machine-type=e2-medium
  
gcloud container clusters get-credentials $GKE_CLUSTER_NAME

# Install Helm v3
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 > get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh

# Install Nginx-ingress with static IP address
helm repo add stable https://kubernetes-charts.storage.googleapis.com
helm install nginx stable/nginx-ingress \
    --set controller.service.loadBalancerIP=$REVERSED_STATIC_IP,rbac.create=true

# Setup mongo secret
kubectl create secret generic mongopassword --from-literal MONGO_PASSWORD=<password_for_mongodb>

#TODO Note: Update project name in k8s folder
exit 1