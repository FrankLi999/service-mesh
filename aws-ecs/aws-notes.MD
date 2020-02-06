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

      http://3.12.154.181:8000/api/currency-exchange-microservice/currency-exchange/from/EUR/to/INR
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

      http://10.0.0.228:8180/api/currency-conversion-microservice/currency-converter/from/EUR/to/INR/quantity/75

    
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

      go to route 53-> hosted zones to check domain currency-dev.com
         https://console.aws.amazon.com/route53/home?region=us-east-2#resource-record-sets:Z00687863QYER02E1C254

      create an EC2 instance in the VPC to test service discovery

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

              
              
## About ELB 
    EC2 dashboard -> create a load balancer instance (application/http load balancer)
    add a listene on port 80
    chosse the vpc for the farget ECS and both of the two az. 

    my-service-lb
    listen on portal 80

    create a new security group: my-service-lb-sg

      allows inbound: http/80/anywhere
    create a target group: my-service-tg
      target type instance, on http port 80


    create a new service: ws-currency-exchange-service-h2-lb
       choose both subnets of the VPC
       security group: add 8000 for inbound
       load balancer type:
        application load balancer 

        add container to the load balancer.
            listening port: 80:http
            create a new target group: currency-exchange-h2-tg
            path pattern: /api/currency-exchange-microservice/*
            evaluation order: 1 
            health check path: /api/currency-exchange-microservice/manage/health

            60 seconds for health check grace peioid

            

        go to ec2 dashboard -> target group
            select currency-exchange-h2-tg
            edit health check:
                overriide : 8000
                adjust timeout settings

         copied the dns name of the load balancer and test the following url:
            http://{lb-dns-name}/api/currency-exchange-microservice/currency-exchange/from/EUR/to/INR

            
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
                  create a new target group: currency-conversion-tg
                  path pattern: /api/currency-conversion-microservice/*
                  evaluation order: 2
                  health check path: /api/currency-conversion-microservice/manage/health

                  60 seconds for health check grace peioid

                  

              go to ec2 dashboard -> target group
                  select currency-conversion-tg
                  edit health check:
                      overriide : 8100
                      adjust timeout settings
                      
            

            test:
            http://{lb-dns-name}/api/currency-conversion-microservice/currency-converter/from/EUR/to/INR/quantity/75

    cleaning up:
      make service replica to 0
      diabale auto scaling

      delete load balancer and target groups

      delete lb services, AWSServiceDiscovery
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