## build customer, preference, and recommendation services.

   cd customer
   mvn clean package
   
   cd preference
   mvn clean package
   
   cd recommandation
   mvn clean package
## For local testing, set up jaeger
oc expose svc/jaeger-collector-headless

update the target port to 14268
spec:
  host: jaeger-collector-headless-istio-system.apps-crc.testing
  subdomain: ''
  to:
    kind: Service
    name: jaeger-collector-headless
    weight: 100
  port:
    targetPort: 14286
3. test local
  
  cd customer/tatget
  java -Dspring.profiles.active=local -jar customer.jar
   
  cd preference/target
  java -Dspring.profiles.active=local -jar preference.jar
   
  cd recommandation
  java -Dspring.profiles.active=local -jar recommendation.jar


   curl http://localhost:8280
## install istioctl

   #> wget https://github.com/istio/istio/releases/download/1.0.5/istio-1.0.5-linux.tar.gz
   #> tar -xzfg istio-1.0.5-linux.tar.gz
   #> cd istio-1.0.5-linux/bin
   #> cp istioctl ~/.crc/bin 

   curl -L https://git.io/getLatestIstio | sh -
   > istioctl version 

   add the privileged SCC to wcm-bpm project.
   > oc adm policy add-scc-to-user privileged -z default -n wcm-bpm
  >  oc adm policy add-scc-to-group anyuid system:serviceaccounts -n istio-system
## create docker images
   > docker login
   > cd customer
   > docker build -t xli9999/customer .
   > docker push xli9999/customer:latest
   > cd preference
   > docker build -t xli9999/preference .
     docker push xli9999/preference:latest

   > cd recommendation
   > docker build -t xli9999/recommendation .
     docker push xli9999/recommendation:latest
## Inject istio sidecar
  oc get clusterserviceversion -n openshift-operators | grep 'Service Mesh'

  oc project wcm-bpm
  cd customer
  Add sidecar.istio.io/inject to the configuration YAML with a value of "true" as illustrated here:

  //oc apply -f <(istioctl kube-inject -f ./kubernetes/Deployment.yml) -n wcm-bpm
  oc apply -f ./kubernetes/config_map.yml -n wcm-bpm
  oc apply -f ./kubernetes/Deployment.yml -n wcm-bpm
  oc create -f ./kubernetes/Service.yml -n wcm-bpm
  oc expose service customer

  cd preference
  #oc apply -f <(istioctl kube-inject -f ./kubernetes/Deployment.yml) -n wcm-bpm
  #oc create -f ./kubernetes/Service.yml -n wcm-bpm

  oc apply -f ./kubernetes/config_map.yml -n wcm-bpm
  oc apply -f ./kubernetes/Deployment.yml -n wcm-bpm
  oc create -f ./kubernetes/Service.yml -n wcm-bpm

  cd recommendation
  #oc apply -f <(istioctl kube-inject -f ./kubernetes/Deployment.yml) -n wcm-bpm
  #oc create -f ./kubernetes/Service.yml -n wcm-bpm

  oc apply -f ./kubernetes/config_map.yml -n wcm-bpm
  oc apply -f ./kubernetes/Deployment.yml -n wcm-bpm
  oc create -f ./kubernetes/Service.yml -n wcm-bpm

  curl http://customer-wcm-bpm.apps-crc.testing/

## Monitoring

oc get route -n istio-system

https://grafana-istio-system.apps-crc.testing/?orgId=1

add Custom Metric:

istioctl create -f istiofiles/recommendation_requestcount.yml -nistio-system

test:
while true; do curl http://customer-wcm-bpm.apps-crc.testing; sleep .2; done


https://prometheus-istio-system.apps-crc.testing/graph

https://prometheus-istio-system.apps-crc.testing/graph?g0.range_input=1m&g0.stacked=1&g0.expr=&g0.tab=0

and search for:
istio_requests_total{destination_service="recommendation.wcm-bpm.svc.cluster.local"}

jaeger tracing:
https://jaeger-istio-system.apps-crc.testing/search

## Add v2 of recommendation
   RecommendationController.RESPONSE_STRING_FORMAT = "recommendation v1 from '%s': %d\n";

   mvn clean package
   docker build -t xli9999/recommendation:v2

   oc apply -f ./kubernetes/Deployment-v2.yml -n wcm-bpm
## Simple routing

while true; do curl http://customer-wcm-bpm.apps-crc.testing; sleep .2; done

trafic should be distributed between v1 and v2.

> istioctl create -f ./istiofiles/destination-rule-recommendation-v1-v2.yml -n wcm-bpm
> istioctl create -f ./istiofiles/virtual-service-recommendation-v2.yml -n wcm-bpm

while true; do curl http://customer-wcm-bpm.apps-crc.testing; sleep .2; done
no traffic should all go to v2.