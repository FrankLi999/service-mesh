## Reference
https://github.com/in28minutes/deploy-spring-microservices-to-aws-ecs-fargate
## create docker images
    docker login
    cd xli9999/aws-currency-exchange-service-h2-xray
    mvn clean package
    docker container run --publish 8000:8000 xli9999/aws-currency-exchange-service-h2-xray:0.0.1-SNAPSHOT
    docker push xli9999/aws-currency-exchange-service-h2-xray:0.0.1-SNAPSHOT

    curl http://localhost:8000/api/currency-exchange-microservice/currency-exchange/from/EUR/to/INR
    
    cd aws-currency-conversion-service-xray
    mvn clean package
    docker container run --publish 8100:8100 xli9999/aws-currency-conversion-service-xray:0.0.1-SNAPSHOT
    docker push xli9999/aws-currency-conversion-service-xray:0.0.1-SNAPSHOT
    curl http://localhost:8100/api/currency-conversion-microservice/currency-converter/from/EUR/to/INR/quantity/75
## Get started with ECS with Fargate
  (two container can be packed into one task defintion, ECS_CONTAINER_METADATA_URI, the uri to query for container metadata)
  ECS get start -> choose sample-app
  create a cluster with the sample app
  create task definition: aws-currency-exchange-service-h2-xray
    add container: xli9999/aws-currency-exchange-service-h2-xray:0.0.1-SNAPSHOT
    memory: 0.5GB
    CPU: 0.25vCPU
    export port:8000
  
  create task definition: aws-currency-conversion-service-xray
    add container: xli9999/aws-currency-conversion-service-xray:0.0.1-SNAPSHOT
    memory: 0.5GB
    CPU: 0.25vCPU
    export port:8100

  create a service
    select task def
    config net work
  cluster
    service

   service integrations:
    log group:
    CloudFormation Stack
    VPC
        subnet 1
        subnet 2
    security group

    find the public ip of the app from task definition
## Deploy apps

## About Run new task directly
   no coresponding service to start it.
   It is a one time thing.

## User ESC to run batch programs
   use "Run new task"