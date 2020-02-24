## Reference

https://github.com/in28minutes/deploy-spring-microservices-to-aws-ecs-fargate

## create docker images

    docker login
    docker network ls
    docker network create currency
    docker network inspect currency
    cd xli9999/aws-currency-exchange-service-h2-xray
    mvn clean package

    docker container run --name currency-exchange  --publish 8000:8000 --network currency xli9999/aws-currency-exchange-service-h2-xray:0.0.1-SNAPSHOT

    docker push xli9999/aws-currency-exchange-service-h2-xray:0.0.1-SNAPSHOT

    curl http://localhost:8000/api/currency-exchange-microservice/currency-exchange/from/EUR/to/INR

    cd aws-currency-conversion-service-xray
    mvn clean package

    docker container run --name currency-conversion --publish 8100:8100 --network currency --env CURRENCY_EXCHANGE_URI=http://currency-exchange:8000 xli9999/aws-currency-conversion-service-xray:0.0.1-SNAPSHOT

    docker push xli9999/aws-currency-conversion-service-xray:0.0.1-SNAPSHOT
    curl http://localhost:8100/api/currency-conversion-microservice/currency-converter/from/EUR/to/INR/quantity/75

## Get started with ECS with Fargate

(two container can be packed into one task defintion, ECS_CONTAINER_METADATA_URI, the uri to query for container metadata)
ECS get start -> choose sample-app
create a cluster with the sample app

find the public IP of the task and test it.
update the sample service and set the number of task to 0.

create farget task definition: aws-currency-exchange-service-h2-xray
add container: xli9999/aws-currency-exchange-service-h2-xray:0.0.1-SNAPSHOT
memory: 0.5GB
CPU: 0.25vCPU
export port:8000

create a service definition ws-currency-exchange-service-h2-xray to run
don't enable Service discovery for now
aws-currency-exchange-service-h2-xray task

      update the security group of the service to allow inbound traffic on port 8000

      find the public ip of the task and try and test
      http://{public-ip}:8080/api/currency-exchange-microservice/currency-exchange/from/EUR/to/INR

      http://3.15.152.93:8000/api/currency-exchange-microservice/currency-exchange/from/EUR/to/INR

create task definition: aws-currency-conversion-service-xray
add container: xli9999/aws-currency-conversion-service-xray:0.0.1-SNAPSHOT
memory: 0.5GB
CPU: 0.25vCPU
export port:8100

    add env var: (will put it in to param store)
        CURRENCY_EXCHANGE_URI http://public-ip:8000

    create a service definition aws-currency-conversion-service-xray to run
      don't enable Service discovery for now
      aws-currency-conversion-service-xray task

      update the security group of the service to allow inbound traffic on port 8100
      update the security group of aws-currency-conversion-service-xray to allow inbound traffic from aws-currency-conversion-service-xray on 8000

      find the public ip of the task and try and test
      http://{public-ip}:8080/api/currency-exchange-microservice/currency-exchange/from/EUR/to/INR

      http://3.15.240.235:8100/api/currency-conversion-microservice/currency-converter/from/EUR/to/INR/quantity/75

## Set up centralized configurations

    go to System manager to create parameters at the bottom of left panel
    /dev/aws-currency-conversion-service-xray/CURRENCY_EXCHANGE_URI

    arn:aws:ssm:us-east-2:445114057331:parameter/dev/aws-currency-conversion-service-xray/CURRENCY_EXCHANGE_URI

      http://{currency-exchange-microservice-public-ip}:8000

      edit the ecsTaskExecutionRole, attach "AmazonSSMReadOnlyAccess" policy

## Added xray sidecar container

    need a add a xray daemon container to the task definition.
    lisening on port 2000/UDP

    Update the task definition to increase to resource needed:
         memory: 1GB
         cpu: 0.5vCPU

         container image: amazon/aws-xray-daemon:1
         port: UDP/2000

    edit the ecsTaskExecutionRole, attach "AWSXRayDaemonWriteAccess" policy

## Enable AWS Service Mesh

    need to service discovery when creating service definitions.

    create a new service: ws-currency-exchange-service-h2-appmesh
       choose at least one subnets of the VPC
       security group: add 8000 for inbound
       load balancer type:
        no load balancer

        enable servie discover and select create new private namespace:
          currency-dev.com
        choose to create a new service discovery service and set
        service discovery name to currency-exchange-service.

        disbale the Enable ECS task health propagation

          Namespace:currency-dev.com
          Service discovery name: currency-exchange-service

          Task Definitiona: ws-currency-exchange-service-h2-xray:1


          update CURRENCY_EXCHANGE_URI from param store to point to
            h




    create a service ws-currency-conversion-services-appmesh

          currency-conversion-services
          Namespace: ns-k3aurzmcr3mxpqai
          Service discovery name: currency-conversion-services
          Task Definitionaws-currency-conversion-service-xray:3


          choose at least one subnets of the VPC
          security group: add 8100 for inbound
          load balancer type:
            no load balancer

          enable servie discover and select create new private namespace:
            currency-dev.com
          choose to create a new service discovery service and set
          service discovery name to currency-conversion-services

        disbale the Enable ECS task health propagation

      go to route 53-> hosted zones to check "hosted zone" currency-dev.com
         https://console.aws.amazon.com/route53/home?region=us-east-2#resource-record-sets:Z00687863QYER02E1C254

      create an EC2 instance in the VPC to test service discovery
        create a key-par named: my_ecs, download key pair: my_ecs.pem

        chmod 400 my_ecs.pem, enable public ip
        ssh -i "my_ecs.pem" ec2-user@ec2-3-14-251-77.us-east-2.compute.amazonaws.com

        curl http://currency-conversion-services.currency-dev.com:8100/api/currency-conversion-microservice/currency-converter/from/EUR/to/INR/quantity/75|jq


    create a service mesh:

    aws console -> Aws Service Mesh -> Meshes
      create a mesh: my-service-mesh

      allow external traffic

      inside a mesh:
          virtual nodes
            logical pointer to a particular task group, such as an ECS services
                 currency-exchange-service-vn - the corresponding service discovery name
                     currency-exchange-services.currency-dev.com

                     create virtual node currency-exchange-service-vn.
                     DNS name point to currency-exchange-services.currency-dev.com
                      port is 8000:http
                 currency-conversion-services-vn - he corresponding service discovery name
                     currency-conversion-services.currency-dev.com

                      create virtual node currency-conversion-services-vn
                     DNS name point to currency-conversion-services.currency-dev.com
                      port is 8100:http
          virtual services:
              abstraction of a real service. provided by a virtual node or virtual router

              the dns name, currency-conversion-services.currency-dev.com -> currency-conversion-services-vn
              the dns name, currency-exchange-services.currency-dev.com -> currency-exchange-service-vn

              create virtual service currency-exchange-services.currency-dev.com that provides virtual node:
                currency-exchange-services-vn
              create virtual service currency-conversion-services.currency-dev.com that provides virtual node:
                currency-conversion-services-vn

              backend registration:
              edit currency-conversion-services-vn, add backend service, currency-exchange-services.currency-dev.com




           update the exchange virtual service to use this virtual router instead of the virtual node.

        integrate task definition with virtual nodes
          create a new revision of task definition for aws-currency-exchange-service-h2-xray
          check "Enable App Mesh integration"

              and set it up
          check Enable proxy configuration and leave rest of the field as is
            this added a sidecar container envoy.

          update the service container to enable the log
          update the xray container to enable the log
          update the envoy container to enable to the log
            update envou container to add the following env cars:
              ENVOY_LOG_LEVEL value trace
              ENABLE_ENVOY_XRAY_TRACING value 1
          update service

          apply the same update to taks definition aws-currency-conversion-service-xray


        check the log on cloudwatch
        go to xray, check service map


        clean up:
            make replica count to 0 to stop the service
            delete the ec2 instance
            delete the RDS instance

            delete route 53, host zones:
              from aws command line:
              aws servicediscovery list-services
              aws servicediscovery delete-service --id={id}

              aws servicediscovery list-namespaces
              aws servicediscovery delete-namespace --id={id}

    {

      id: 10002,
      from: "EUR",
      to: "INR",
      conversionMultiple: 75,
      quantity: 75,
      totalCalculatedAmount: 5625,
      exchangeEnvironmentInfo: "{"DockerId":"6f2eeafa6e31305aed59e7bade3f1be113e26f352cbab276c0220042be447f78","Name":"aws-currency-exchange-service-h2-xray","DockerName":"ecs-aws-currency-exchange-service-h2-xray-3-aws-currency-exchange-service-h2-xray-86fac5f5a48fbee32100","Image":"xli9999/aws-currency-exchange-service-h2-xray:0.0.1-SNAPSHOT","ImageID":"sha256:0b43198c6b197958439de9e645137d76cd8e24e85a5e2c6157c3490dd1b31f6c","Labels":{"com.amazonaws.ecs.cluster":"arn:aws:ecs:us-east-2:445114057331:cluster/default","com.amazonaws.ecs.container-name":"aws-currency-exchange-service-h2-xray","com.amazonaws.ecs.task-arn":"arn:aws:ecs:us-east-2:445114057331:task/553fcaa8-f9d5-403f-830b-d223bbf9bad4","com.amazonaws.ecs.task-definition-family":"aws-currency-exchange-service-h2-xray","com.amazonaws.ecs.task-definition-version":"3"},"DesiredStatus":"RUNNING","KnownStatus":"RUNNING","Limits":{"CPU":0,"Memory":0},"CreatedAt":"2020-02-23T22:36:16.724644685Z","StartedAt":"2020-02-23T22:36:17.567278355Z","Type":"NORMAL","Networks":[{"NetworkMode":"awsvpc","IPv4Addresses":["10.0.1.37"]}],"Volumes":[{"DockerName":"4bd7b3e234f5f16d2e805a99a2ff0cf8519ee1b24759d16fc532ad7fbe7cebdc","Source":"/var/lib/docker/volumes/4bd7b3e234f5f16d2e805a99a2ff0cf8519ee1b24759d16fc532ad7fbe7cebdc/_data","Destination":"/tmp"}]}",
      conversionEnvironmentInfo: "{"DockerId":"5179e4cd0adcd2ac837ebebbee28617f7537da5ff47a3936e07396a9989c52b2","Name":"aws-currency-conversion-service-xray","DockerName":"ecs-aws-currency-conversion-service-xray-5-aws-currency-conversion-service-xray-96fecfbbced0aabd4400","Image":"xli9999/aws-currency-conversion-service-xray:0.0.1-SNAPSHOT","ImageID":"sha256:5df23c23dd23ba064909e24982c66ecf2e982c624d1447bfeaae5d85b3e5d710","Labels":{"com.amazonaws.ecs.cluster":"arn:aws:ecs:us-east-2:445114057331:cluster/default","com.amazonaws.ecs.container-name":"aws-currency-conversion-service-xray","com.amazonaws.ecs.task-arn":"arn:aws:ecs:us-east-2:445114057331:task/1e36cfd1-a30b-4660-9e6c-eb79dd24698d","com.amazonaws.ecs.task-definition-family":"aws-currency-conversion-service-xray","com.amazonaws.ecs.task-definition-version":"5"},"DesiredStatus":"RUNNING","KnownStatus":"RUNNING","Limits":{"CPU":0,"Memory":0},"CreatedAt":"2020-02-23T22:44:04.366586839Z","StartedAt":"2020-02-23T22:44:05.453784709Z","Type":"NORMAL","Networks":[{"NetworkMode":"awsvpc","IPv4Addresses":["10.0.1.136"]}],"Volumes":[{"DockerName":"75ea069d26e87b1055bf3dccd792e91136fef1d52e34f0f3aef7e5f6cc2b89a3","Source":"/var/lib/docker/volumes/75ea069d26e87b1055bf3dccd792e91136fef1d52e34f0f3aef7e5f6cc2b89a3/_data","Destination":"/tmp"}]}"

    }

## About ELB

    EC2 dashboard -> create a load balancer instance (application/http load balancer)
    add a listene on port 80
    chosse the vpc for the farget ECS and both of the two az.

    my-service-lb
    listen on portal 80

    create a new security group: my-service-lb-sg

      allows inbound: http/80/anywhere
    create a target group: myservicetg
      target type instance, on http port 80


    create a new service: ws-currency-exchange-service-h2-lb
       choose both subnets of the VPC
       security group: add 8000 for inbound
       load balancer type:
        application load balancer

        add container to the load balancer.
            listening port: 80:http
            create a new target group: currencyexchangeservicetg
            path pattern: /api/currency-exchange-microservice/*
            evaluation order: 1
            health check path: /api/currency-exchange-microservice/manage/health

            60 seconds for health check grace peioid

            service discovery: ws-currency-exchange-service-h2-lb.currency-dev.com

        go to ec2 dashboard -> target group:
            select existing currency-exchange-service
            edit health check:
                overriide : 8000
                adjust timeout settings

         copied the dns name of the load balancer and test the following url:
            http://{lb-dns-name}/api/currency-exchange-microservice/currency-exchange/from/EUR/to/INR
            http://my-service-lb-53868438.us-east-2.elb.amazonaws.com/api/currency-exchange-microservice/currency-exchange/from/EUR/to/INR



            /api/currency-exchange-microservice/currency-exchange/from/EUR/to/INR

          update CURRENCY_EXCHANGE_URI from param store to point to http://{lb-dns-name}


          on last page, can enable auto-scaling
                min task:
                desired task:
                max tasks

                auto scaling policy:
                  target tracking
                    on cpu utilization
                    on memory usage
                    on request per target
                  step scaling
    create a service ws-currency-conversion-service-lb

          choose both subnets of the VPC
            security group: add 8100 for inbound
            load balancer type:
              application load balancer

              add container to the load balancer.
                  listening port: 80:http
                  create a new target group: currencyconversiontg
                  path pattern: /api/currency-conversion-microservice/*
                  evaluation order: 2
                  health check path: /api/currency-conversion-microservice/manage/health

                  60 seconds for health check grace peioid



              go to ec2 dashboard -> target group
                  select currency-conversion-tg
                  edit health check:
                      overriide : 8100
                      adjust timeout settings

                  auto scaling: conversion_service_policy

            test:
            http://{lb-dns-name}/api/currency-conversion-microservice/currency-converter/from/EUR/to/INR/quantity/75
            http://my-service-lb-53868438.us-east-2.elb.amazonaws.com/api/currency-conversion-microservice/currency-converter/from/EUR/to/INR/quantity/75
    cleaning up:
      make service replica to 0
      diabale auto scaling

      delete load balancer and target groups

      delete lb services, AWSServiceDiscovery

## Former2 scanning

step 1: create an IAM account with ReadOnlyAccess
step 2: https://former2.com and install chrome former2 extension
step 3: provided use the api key and secret created in step 1 and select the "Scan Account" button
step 4: select ec2, mysql

## About Run new task directly

no coresponding service to start it.
It is a one time thing.

## User ESC to run batch programs

use "Run new task"

## MySQL support

spring boot service properties:
RDS_HOSTNAME
RDS_PORT
RDS_DB_NAME
RDS_USERNAME
RDS_PASSWORD

MYSQL:5.7 docker env vars:
MYSQL_ROOT_PASSWORD
MYSQL_USER
MYSQL_PASSWORD
MYSQL_DATABASE

run mysql docker:
docker run --detach --env MYSQL_ROOT_PASSWORD=dummypassword --network currency --env MYSQL_USER=exchange-db-user --env MYSQL_PASSWORD=dummyexchange --env MYSQL_DATABASE=exchange-db --name mysql --publish 3306:3306 mysql:5.7

    docker container run --name currency-exchange  --publish 8000:8000 --network currency --env RDS_HOSTNAME=mysql xli9999/aws-currency-exchange-service-mysql:0.0.1-SNAPSHOT

    docker push xli9999/aws-currency-exchange-service-mysql:0.0.1-SNAPSHOT

    curl http://localhost:8000/api/currency-exchange-microservice/currency-exchange/from/EUR/to/INR

Create MYSQL with AWS RDS: use free tire
RDS_HOSTNAME
RDS_PORT
RDS_DB_NAME: the initial database name (- is not allow)
RDS_USERNAME : the master user
RDS_PASSWORD : the master user pwd

      create a new service group
      use the farget cluster vpc

    Create task definition for aws-currency-exchange-service-mysql
       set up env vars
        RDS_HOSTNAME
        RDS_PORT
        RDS_DB_NAME: the initial database name (- is not allow)
        RDS_USERNAME : the master user
        RDS_PASSWORD : the master user pwd

        edit application security group for port 8000, record the security group id.
        create a new mysql security groups to allow inbound traffic(mysql/aurora) over port 3306 from the application. (custom/the application security group id )
