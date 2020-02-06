## Reference
https://github.com/in28minutes/deploy-spring-microservices-to-aws-ecs-fargate

## Get started with ECS with Fargate

    mvn clean package
    docker container run --publish 8000:8000 xli9999/aws-currency-exchange-service:0.0.0-SNAPSHOT
    docker push

  ECS get start -> choose sample-app
  create a cluster with the sample app
  create task definition
    add container
    // container definition
  
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