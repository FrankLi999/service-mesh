// npm i -g aws-cdk

import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import rds = require('@aws-cdk/aws-rds');
import elasticloadbalancingv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import applicationautoscaling = require('@aws-cdk/aws-applicationautoscaling');
import cdk = require('@aws-cdk/cdk');

class MyStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    const EC2Instance = new ec2.CfnInstance(this, 'EC2Instance', {
      imageId: "ami-0e38b48473ea57778",
      instanceType: "t2.micro",
      keyName: "my_ecs",
      availabilityZone: "us-east-2a",
      tenancy: "default",
      subnetId: "subnet-08d3101feec0e17da",
      ebsOptimized: false,
      securityGroupIds: [
        "sg-0e73dfed1e85cb46e"
      ],
      sourceDestCheck: true,
      blockDeviceMappings: [
        {
          deviceName: "/dev/xvda",
          ebs: {
            encrypted: false,
            volumeSize: 8,
            snapshotId: "snap-0ed4f88be6558a32a",
            volumeType: "gp2",
            deleteOnTermination: true
          }
        }
      ],
      hibernationOptions: {
        configured: false
      }
    });

    const ECSCluster = new ecs.CfnCluster(this, 'ECSCluster', {
      clusterName: "default",
      clusterSettings: [
        {
          name: "containerInsights",
          value: "disabled"
        }
      ]
    });

    const RDSDBInstance = new rds.CfnDBInstance(this, 'RDSDBInstance', {
      dbInstanceIdentifier: "wcmbpm",
      allocatedStorage: 20,
      dbInstanceClass: "db.t2.micro",
      engine: "mysql",
      masterUsername: "admin",
      masterUserPassword: "REPLACEME",
      preferredBackupWindow: "07:30-08:00",
      backupRetentionPeriod: 7,
      availabilityZone: "us-east-2b",
      preferredMaintenanceWindow: "mon:06:04-mon:06:34",
      multiAZ: false,
      engineVersion: "5.7.22",
      autoMinorVersionUpgrade: true,
      licenseModel: "general-public-license",
      publiclyAccessible: true,
      storageType: "gp2",
      port: 3306,
      storageEncrypted: false,
      copyTagsToSnapshot: true,
      monitoringInterval: 0,
      enableIAMDatabaseAuthentication: false,
      enablePerformanceInsights: false,
      deletionProtection: false,
      dbSubnetGroupName: "default-vpc-0e12e822c1e5549cf",
      vpcSecurityGroups: [
        "sg-06b6268a569621a85"
      ],
      maxAllocatedStorage: 1000,
      dbParameterGroupName: "default.mysql5.7",
      optionGroupName: "default:mysql-5-7",
      caCertificateIdentifier: "rds-ca-2019"
    });

    const RDSDBSubnetGroup = new rds.CfnDBSubnetGroup(this, 'RDSDBSubnetGroup', {
      dbSubnetGroupDescription: "Created from the RDS Management Console",
      dbSubnetGroupName: "default-vpc-0e12e822c1e5549cf",
      subnetIds: [
        "subnet-08d3101feec0e17da",
        "subnet-0c86eeb5d3ab2e031"
      ]
    });

    const RDSDBSecurityGroup = new rds.CfnDBSecurityGroup(this, 'RDSDBSecurityGroup', {
      groupDescription: ECSCluster.ref
    });

    const EC2SecurityGroup = new ec2.CfnSecurityGroup(this, 'EC2SecurityGroup', {
      groupDescription: "2020-02-23T21:47:44.823Z",
      groupName: "ws-cur-1498",
      vpcId: "vpc-0e12e822c1e5549cf",
      securityGroupIngress: [
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 80,
          ipProtocol: "tcp",
          toPort: 80
        },
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 8100,
          ipProtocol: "tcp",
          toPort: 8100
        }
      ],
      securityGroupEgress: [
        {
          cidrIp: "0.0.0.0/0",
          ipProtocol: "-1"
        }
      ]
    });

    const EC2SecurityGroup2 = new ec2.CfnSecurityGroup(this, 'EC2SecurityGroup2', {
      groupDescription: "load-balancer-wizard-1 created on 2020-02-23T17:50:36.218-05:00",
      groupName: "my-service-lb-sg",
      vpcId: "vpc-0e12e822c1e5549cf",
      securityGroupIngress: [
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 80,
          ipProtocol: "tcp",
          toPort: 80
        },
        {
          cidrIpv6: "::/0",
          fromPort: 80,
          ipProtocol: "tcp",
          toPort: 80
        }
      ],
      securityGroupEgress: [
        {
          cidrIp: "0.0.0.0/0",
          ipProtocol: "-1"
        }
      ]
    });

    const EC2SecurityGroup3 = new ec2.CfnSecurityGroup(this, 'EC2SecurityGroup3', {
      groupDescription: "2020-02-23T21:54:13.567Z",
      groupName: "ws-cur-4246",
      vpcId: "vpc-0e12e822c1e5549cf",
      securityGroupIngress: [
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 80,
          ipProtocol: "tcp",
          toPort: 80
        },
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 8100,
          ipProtocol: "tcp",
          toPort: 8100
        },
        {
          cidrIpv6: "::/0",
          description: "",
          fromPort: 8100,
          ipProtocol: "tcp",
          toPort: 8100
        }
      ],
      securityGroupEgress: [
        {
          cidrIp: "0.0.0.0/0",
          ipProtocol: "-1"
        }
      ]
    });

    const EC2SecurityGroup4 = new ec2.CfnSecurityGroup(this, 'EC2SecurityGroup4', {
      groupDescription: "launch-wizard-1 created 2020-02-23T17:00:57.669-05:00",
      groupName: "launch-wizard-1",
      vpcId: "vpc-0e12e822c1e5549cf",
      securityGroupIngress: [
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 22,
          ipProtocol: "tcp",
          toPort: 22
        }
      ],
      securityGroupEgress: [
        {
          cidrIp: "0.0.0.0/0",
          ipProtocol: "-1"
        }
      ]
    });

    const EC2SecurityGroup5 = new ec2.CfnSecurityGroup(this, 'EC2SecurityGroup5', {
      groupDescription: "default VPC security group",
      groupName: ECSCluster.ref,
      vpcId: "vpc-0e12e822c1e5549cf",
      securityGroupIngress: [
        {
          sourceSecurityGroupId: "sg-03edaec6c9ff603a8",
          sourceSecurityGroupOwnerId: "445114057331",
          ipProtocol: "-1"
        }
      ],
      securityGroupEgress: [
        {
          cidrIp: "0.0.0.0/0",
          ipProtocol: "-1"
        }
      ]
    });

    const EC2SecurityGroup6 = new ec2.CfnSecurityGroup(this, 'EC2SecurityGroup6', {
      groupDescription: "Created by RDS management console",
      groupName: "sg_mysql",
      vpcId: "vpc-0e12e822c1e5549cf",
      securityGroupIngress: [
        {
          cidrIp: "162.211.184.9/32",
          fromPort: 3306,
          ipProtocol: "tcp",
          toPort: 3306
        }
      ],
      securityGroupEgress: [
        {
          cidrIp: "0.0.0.0/0",
          ipProtocol: "-1"
        }
      ]
    });

    const EC2SecurityGroup7 = new ec2.CfnSecurityGroup(this, 'EC2SecurityGroup7', {
      groupDescription: "2020-02-23T21:41:00.306Z",
      groupName: "ws-cur-477",
      vpcId: "vpc-0e12e822c1e5549cf",
      securityGroupIngress: [
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 80,
          ipProtocol: "tcp",
          toPort: 80
        },
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 8100,
          ipProtocol: "tcp",
          toPort: 8100
        }
      ],
      securityGroupEgress: [
        {
          cidrIp: "0.0.0.0/0",
          ipProtocol: "-1"
        }
      ]
    });

    const EC2SecurityGroup8 = new ec2.CfnSecurityGroup(this, 'EC2SecurityGroup8', {
      groupDescription: "2020-02-23T22:54:20.543Z",
      groupName: "ws-cur-6874",
      vpcId: "vpc-0e12e822c1e5549cf",
      securityGroupIngress: [
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 80,
          ipProtocol: "tcp",
          toPort: 80
        },
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 8000,
          ipProtocol: "tcp",
          toPort: 8000
        }
      ],
      securityGroupEgress: [
        {
          cidrIp: "0.0.0.0/0",
          ipProtocol: "-1"
        }
      ]
    });

    const EC2SecurityGroup9 = new ec2.CfnSecurityGroup(this, 'EC2SecurityGroup9', {
      groupDescription: "2020-02-23T21:04:34.777Z",
      groupName: "ws-cur-2621",
      vpcId: "vpc-0e12e822c1e5549cf",
      securityGroupIngress: [
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 80,
          ipProtocol: "tcp",
          toPort: 80
        },
        {
          cidrIp: "0.0.0.0/0",
          description: "",
          fromPort: 8000,
          ipProtocol: "tcp",
          toPort: 8000
        },
        {
          cidrIpv6: "::/0",
          description: "",
          fromPort: 8000,
          ipProtocol: "tcp",
          toPort: 8000
        }
      ],
      securityGroupEgress: [
        {
          cidrIp: "0.0.0.0/0",
          ipProtocol: "-1"
        }
      ]
    });

    const EC2SecurityGroup10 = new ec2.CfnSecurityGroup(this, 'EC2SecurityGroup10', {
      groupDescription: "2020-02-23T21:07:09.230Z",
      groupName: "aws-cu-2871",
      vpcId: "vpc-0e12e822c1e5549cf",
      securityGroupIngress: [
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 80,
          ipProtocol: "tcp",
          toPort: 80
        },
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 8100,
          ipProtocol: "tcp",
          toPort: 8100
        },
        {
          cidrIpv6: "::/0",
          description: "",
          fromPort: 8100,
          ipProtocol: "tcp",
          toPort: 8100
        }
      ],
      securityGroupEgress: [
        {
          cidrIp: "0.0.0.0/0",
          ipProtocol: "-1"
        }
      ]
    });

    const EC2SecurityGroup11 = new ec2.CfnSecurityGroup(this, 'EC2SecurityGroup11', {
      groupDescription: "2020-02-23T21:36:03.493Z",
      groupName: "ws-cur-3908",
      vpcId: "vpc-0e12e822c1e5549cf",
      securityGroupIngress: [
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 80,
          ipProtocol: "tcp",
          toPort: 80
        },
        {
          cidrIp: "0.0.0.0/0",
          fromPort: 8000,
          ipProtocol: "tcp",
          toPort: 8000
        },
        {
          cidrIpv6: "::/0",
          description: "",
          fromPort: 8000,
          ipProtocol: "tcp",
          toPort: 8000
        }
      ],
      securityGroupEgress: [
        {
          cidrIp: "0.0.0.0/0",
          ipProtocol: "-1"
        }
      ]
    });

    const ElasticLoadBalancingV2ListenerRule = new elasticloadbalancingv2.CfnListenerRule(this, 'ElasticLoadBalancingV2ListenerRule', {
      priority: "1",
      listenerArn: "arn:aws:elasticloadbalancing:us-east-2:445114057331:listener/app/my-service-lb/39baed772591d6c0/930c98eb2dcb4690",
      conditions: [
        {
          field: "path-pattern",
          values: [
            "/api/currency-exchange-microservice/*"
          ]
        }
      ],
      actions: [
        {
          type: "forward",
          targetGroupArn: "arn:aws:elasticloadbalancing:us-east-2:445114057331:targetgroup/currencyexchangeservicetg/1d71df4075d5ad16",
          forwardConfig: {
            targetGroups: [
              {
                targetGroupArn: "arn:aws:elasticloadbalancing:us-east-2:445114057331:targetgroup/currencyexchangeservicetg/1d71df4075d5ad16",
                weight: 1
              }
            ],
            targetGroupStickinessConfig: {
              enabled: false
            }
          }
        }
      ]
    });

    const ElasticLoadBalancingV2ListenerRule2 = new elasticloadbalancingv2.CfnListenerRule(this, 'ElasticLoadBalancingV2ListenerRule2', {
      priority: "2",
      listenerArn: "arn:aws:elasticloadbalancing:us-east-2:445114057331:listener/app/my-service-lb/39baed772591d6c0/930c98eb2dcb4690",
      conditions: [
        {
          field: "path-pattern",
          values: [
            "/api/currency-conversion-microservice/*"
          ]
        }
      ],
      actions: [
        {
          type: "forward",
          targetGroupArn: "arn:aws:elasticloadbalancing:us-east-2:445114057331:targetgroup/currencyconversiontg/88d30716639bff38",
          forwardConfig: {
            targetGroups: [
              {
                targetGroupArn: "arn:aws:elasticloadbalancing:us-east-2:445114057331:targetgroup/currencyconversiontg/88d30716639bff38",
                weight: 1
              }
            ],
            targetGroupStickinessConfig: {
              enabled: false
            }
          }
        }
      ]
    });

    const ElasticLoadBalancingV2Listener = new elasticloadbalancingv2.CfnListener(this, 'ElasticLoadBalancingV2Listener', {
      loadBalancerArn: "arn:aws:elasticloadbalancing:us-east-2:445114057331:loadbalancer/app/my-service-lb/39baed772591d6c0",
      port: 80,
      protocol: "HTTP",
      defaultActions: [
        {
          targetGroupArn: "arn:aws:elasticloadbalancing:us-east-2:445114057331:targetgroup/myservicetg/1e7ac7298d055281",
          type: "forward"
        }
      ]
    });

    const ElasticLoadBalancingV2LoadBalancer = new elasticloadbalancingv2.CfnLoadBalancer(this, 'ElasticLoadBalancingV2LoadBalancer', {
      name: "my-service-lb",
      scheme: "internet-facing",
      type: "application",
      subnets: [
        "subnet-08d3101feec0e17da",
        "subnet-0c86eeb5d3ab2e031"
      ],
      securityGroups: [
        EC2SecurityGroup2.ref
      ],
      ipAddressType: "ipv4",
      loadBalancerAttributes: [
        {
          key: "access_logs.s3.enabled",
          value: "false"
        },
        {
          key: "idle_timeout.timeout_seconds",
          value: "60"
        },
        {
          key: "deletion_protection.enabled",
          value: "false"
        },
        {
          key: "routing.http2.enabled",
          value: "true"
        },
        {
          key: "routing.http.drop_invalid_header_fields.enabled",
          value: "false"
        }
      ]
    });

    const ECSService = new ecs.CfnService(this, 'ECSService', {
      serviceName: "ws-currency-exchange-service-h2-appmesh",
      cluster: ECSCluster.getAtt('Arn'),
      serviceRegistries: [
        {
          registryArn: "arn:aws:servicediscovery:us-east-2:445114057331:service/srv-yv4x7pmjmrx6kehz"
        }
      ],
      desiredCount: 1,
      launchType: "FARGATE",
      platformVersion: "LATEST",
      taskDefinition: "arn:aws:ecs:us-east-2:445114057331:task-definition/aws-currency-exchange-service-h2-xray:3",
      deploymentConfiguration: {
        maximumPercent: 200,
        minimumHealthyPercent: 100
      },
      role: "arn:aws:iam::445114057331:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS",
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "ENABLED",
          securityGroups: [
            EC2SecurityGroup11.ref
          ],
          subnets: [
            "subnet-0c86eeb5d3ab2e031",
            "subnet-08d3101feec0e17da"
          ]
        }
      },
      schedulingStrategy: "REPLICA"
    });

    const ECSService2 = new ecs.CfnService(this, 'ECSService2', {
      serviceName: "ws-currency-conversion-services-appmesh",
      cluster: ECSCluster.getAtt('Arn'),
      serviceRegistries: [
        {
          registryArn: "arn:aws:servicediscovery:us-east-2:445114057331:service/srv-z32i4oh6oq4j4tg2"
        }
      ],
      desiredCount: 1,
      launchType: "FARGATE",
      platformVersion: "LATEST",
      taskDefinition: "arn:aws:ecs:us-east-2:445114057331:task-definition/aws-currency-conversion-service-xray:5",
      deploymentConfiguration: {
        maximumPercent: 200,
        minimumHealthyPercent: 100
      },
      role: "arn:aws:iam::445114057331:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS",
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "ENABLED",
          securityGroups: [
            EC2SecurityGroup3.ref
          ],
          subnets: [
            "subnet-0c86eeb5d3ab2e031",
            "subnet-08d3101feec0e17da"
          ]
        }
      },
      schedulingStrategy: "REPLICA"
    });

    const ECSService3 = new ecs.CfnService(this, 'ECSService3', {
      serviceName: "ws-currency-exchange-service-h2-lb",
      cluster: ECSCluster.getAtt('Arn'),
      loadBalancers: [
        {
          targetGroupArn: "arn:aws:elasticloadbalancing:us-east-2:445114057331:targetgroup/currencyexchangeservicetg/1d71df4075d5ad16",
          containerName: "aws-currency-exchange-service-h2-xray",
          containerPort: 8000
        }
      ],
      serviceRegistries: [
        {
          registryArn: "arn:aws:servicediscovery:us-east-2:445114057331:service/srv-yv4x7pmjmrx6kehz"
        }
      ],
      desiredCount: 1,
      launchType: "FARGATE",
      platformVersion: "LATEST",
      taskDefinition: "arn:aws:ecs:us-east-2:445114057331:task-definition/aws-currency-exchange-service-h2-xray:3",
      deploymentConfiguration: {
        maximumPercent: 200,
        minimumHealthyPercent: 100
      },
      role: "arn:aws:iam::445114057331:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS",
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "ENABLED",
          securityGroups: [
            EC2SecurityGroup8.ref
          ],
          subnets: [
            "subnet-0c86eeb5d3ab2e031",
            "subnet-08d3101feec0e17da"
          ]
        }
      },
      healthCheckGracePeriodSeconds: 120,
      schedulingStrategy: "REPLICA"
    });

    const ECSService4 = new ecs.CfnService(this, 'ECSService4', {
      serviceName: "ws-currency-conversion-service-lb",
      cluster: ECSCluster.getAtt('Arn'),
      loadBalancers: [
        {
          targetGroupArn: "arn:aws:elasticloadbalancing:us-east-2:445114057331:targetgroup/currencyconversiontg/88d30716639bff38",
          containerName: "aws-currency-conversion-service-xray",
          containerPort: 8100
        }
      ],
      serviceRegistries: [
        {
          registryArn: "arn:aws:servicediscovery:us-east-2:445114057331:service/srv-z32i4oh6oq4j4tg2"
        }
      ],
      desiredCount: 1,
      launchType: "FARGATE",
      platformVersion: "LATEST",
      taskDefinition: "arn:aws:ecs:us-east-2:445114057331:task-definition/aws-currency-conversion-service-xray:5",
      deploymentConfiguration: {
        maximumPercent: 200,
        minimumHealthyPercent: 100
      },
      role: "arn:aws:iam::445114057331:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS",
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "ENABLED",
          securityGroups: [
            "sg-031ff400fc9c0987f"
          ],
          subnets: [
            "subnet-0c86eeb5d3ab2e031",
            "subnet-08d3101feec0e17da"
          ]
        }
      },
      healthCheckGracePeriodSeconds: 120,
      schedulingStrategy: "REPLICA"
    });

    const ECSTaskDefinition = new ecs.CfnTaskDefinition(this, 'ECSTaskDefinition', {
      containerDefinitions: [
        {
          essential: true,
          image: "xli9999/aws-currency-exchange-service-h2-xray:0.0.1-SNAPSHOT",
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              awslogs- group: "/ecs/aws-currency-exchange-service-h2-xray",
            awslogs- region: "us-east-2",
          awslogs- stream - prefix: "ecs"
                        }
                    },
  name: "aws-currency-exchange-service-h2-xray",
  portMappings: [
    {
      containerPort: 8000,
      hostPort: 8000,
      protocol: "tcp"
    }
  ]
},
{
  environment: [
    {
      name: "APPMESH_VIRTUAL_NODE_NAME",
      value: "mesh/my-service-mesh/virtualNode/currency-exchange-service-vn"
    },
    {
      name: "ENABLE_ENVOY_XRAY_TRACING",
      value: "1"
    },
    {
      name: "ENVOY_LOG_LEVEL",
      value: "trace"
    }
  ],
    essential: true,
      healthCheck: {
    command: [
      "CMD-SHELL",
      "curl -s http://localhost:9901/server_info | grep state | grep -q LIVE"
    ],
      interval: 5,
        timeout: 2,
          retries: 3,
            startPeriod: 10
  },
  image: "840364872350.dkr.ecr.us-west-2.amazonaws.com/aws-appmesh-envoy:v1.12.1.0-prod",
    logConfiguration: {
    logDriver: "awslogs",
      options: {
      awslogs - group: "/ecs/aws-currency-exchange-service-h2-xray",
        awslogs - region: "us-east-2",
          awslogs - stream - prefix: "ecs"
    }
  },
  memory: 500,
    name: "envoy",
      user: "1337"
},
{
  essential: true,
    image: "amazon/aws-xray-daemon:1",
      logConfiguration: {
    logDriver: "awslogs",
      options: {
      awslogs - group: "/ecs/aws-currency-exchange-service-h2-xray",
        awslogs - region: "us-east-2",
          awslogs - stream - prefix: "ecs"
    }
  },
  name: "xray"
}
            ],
family: "aws-currency-exchange-service-h2-xray",
  taskRoleArn: "arn:aws:iam::445114057331:role/ecsTaskExecutionRole",
    executionRoleArn: "arn:aws:iam::445114057331:role/ecsTaskExecutionRole",
      networkMode: "awsvpc",
        requiresCompatibilities: [
          "FARGATE"
        ],
          cpu: "512",
            memory: "1024"
        });

const ECSTaskDefinition2 = new ecs.CfnTaskDefinition(this, 'ECSTaskDefinition2', {
  containerDefinitions: [
    {
      essential: true,
      image: "xli9999/aws-currency-conversion-service-xray:0.0.1-SNAPSHOT",
      logConfiguration: {
        logDriver: "awslogs",
        options: {
          awslogs- group: "/ecs/aws-currency-conversion-service-xray",
        awslogs- region: "us-east-2",
      awslogs- stream - prefix: "ecs"
                        }
                    },
name: "aws-currency-conversion-service-xray",
  portMappings: [
    {
      containerPort: 8100,
      hostPort: 8100,
      protocol: "tcp"
    }
  ],
    secrets: [
      {
        name: "CURRENCY_EXCHANGE_URI",
        valueFrom: "arn:aws:ssm:us-east-2:445114057331:parameter/dev/aws-currency-conversion-service-xray/CURRENCY_EXCHANGE_URI"
      }
    ]
                },
{
  environment: [
    {
      name: "APPMESH_VIRTUAL_NODE_NAME",
      value: "mesh/my-service-mesh/virtualNode/currency-conversion-services-vn"
    },
    {
      name: "ENABLE_ENVOY_XRAY_TRACING",
      value: "1"
    },
    {
      name: "ENVOY_LOG_LEVEL",
      value: "trace"
    }
  ],
    essential: true,
      healthCheck: {
    command: [
      "CMD-SHELL",
      "curl -s http://localhost:9901/server_info | grep state | grep -q LIVE"
    ],
      interval: 5,
        timeout: 2,
          retries: 3,
            startPeriod: 10
  },
  image: "840364872350.dkr.ecr.us-west-2.amazonaws.com/aws-appmesh-envoy:v1.12.1.0-prod",
    logConfiguration: {
    logDriver: "awslogs",
      options: {
      awslogs - group: "/ecs/aws-currency-conversion-service-xray",
        awslogs - region: "us-east-2",
          awslogs - stream - prefix: "ecs"
    }
  },
  memory: 500,
    name: "envoy",
      user: "1337"
},
{
  essential: true,
    image: "amazon/aws-xray-daemon:1",
      logConfiguration: {
    logDriver: "awslogs",
      options: {
      awslogs - group: "/ecs/aws-currency-conversion-service-xray",
        awslogs - region: "us-east-2",
          awslogs - stream - prefix: "ecs"
    }
  },
  name: "xray",
    portMappings: [
      {
        containerPort: 2000,
        hostPort: 2000,
        protocol: "udp"
      }
    ]
}
            ],
family: "aws-currency-conversion-service-xray",
  taskRoleArn: "arn:aws:iam::445114057331:role/ecsTaskExecutionRole",
    executionRoleArn: "arn:aws:iam::445114057331:role/ecsTaskExecutionRole",
      networkMode: "awsvpc",
        requiresCompatibilities: [
          "FARGATE"
        ],
          cpu: "512",
            memory: "1024"
        });

const ApplicationAutoScalingScalableTarget = new applicationautoscaling.CfnScalableTarget(this, 'ApplicationAutoScalingScalableTarget', {
  maxCapacity: 2,
  minCapacity: 1,
  resourceId: "service/default/ws-currency-conversion-service-lb",
  roleARN: "arn:aws:iam::445114057331:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService",
  scalableDimension: "ecs:service:DesiredCount",
  serviceNamespace: "ecs"
});

const ApplicationAutoScalingScalingPolicy = new applicationautoscaling.CfnScalingPolicy(this, 'ApplicationAutoScalingScalingPolicy', {
  policyName: "conversion_service_policy",
  policyType: "TargetTrackingScaling",
  resourceId: "service/default/ws-currency-conversion-service-lb",
  scalableDimension: "ecs:service:DesiredCount",
  serviceNamespace: "ecs",
  targetTrackingScalingPolicyConfiguration: {
    predefinedMetricSpecification: {
      predefinedMetricType: "ECSServiceAverageCPUUtilization"
    },
    scaleInCooldown: 300,
    scaleOutCooldown: 300,
    targetValue: 70
  }
});

const RDSDBParameterGroup = new rds.CfnDBParameterGroup(this, 'RDSDBParameterGroup', {
  description: "Default parameter group for mysql5.7",
  family: "mysql5.7"
});

const RDSDBParameterGroup2 = new rds.CfnDBParameterGroup(this, 'RDSDBParameterGroup2', {
  description: "Default parameter group for mysql8.0",
  family: "mysql8.0"
});

const RDSOptionGroup = new rds.CfnOptionGroup(this, 'RDSOptionGroup', {
  engineName: "mysql",
  majorEngineVersion: "5.7",
  optionGroupDescription: "Default option group for mysql 5.7"
});

const RDSOptionGroup2 = new rds.CfnOptionGroup(this, 'RDSOptionGroup2', {
  engineName: "mysql",
  majorEngineVersion: "8.0",
  optionGroupDescription: "Default option group for mysql 8.0"
});

new cdk.Output(this, 'EC2InstanceRef', { value: EC2Instance.ref, disableExport: true })
new cdk.Output(this, 'ECSClusterRef', { value: ECSCluster.ref, disableExport: true })
new cdk.Output(this, 'RDSDBInstanceRef', { value: RDSDBInstance.ref, disableExport: true })
new cdk.Output(this, 'RDSDBSubnetGroupRef', { value: RDSDBSubnetGroup.ref, disableExport: true })
new cdk.Output(this, 'RDSDBSecurityGroupRef', { value: RDSDBSecurityGroup.ref, disableExport: true })
new cdk.Output(this, 'EC2SecurityGroupRef', { value: EC2SecurityGroup.ref, disableExport: true })
new cdk.Output(this, 'EC2SecurityGroup2Ref', { value: EC2SecurityGroup2.ref, disableExport: true })
new cdk.Output(this, 'EC2SecurityGroup3Ref', { value: EC2SecurityGroup3.ref, disableExport: true })
new cdk.Output(this, 'EC2SecurityGroup4Ref', { value: EC2SecurityGroup4.ref, disableExport: true })
new cdk.Output(this, 'EC2SecurityGroup5Ref', { value: EC2SecurityGroup5.ref, disableExport: true })
new cdk.Output(this, 'EC2SecurityGroup6Ref', { value: EC2SecurityGroup6.ref, disableExport: true })
new cdk.Output(this, 'EC2SecurityGroup7Ref', { value: EC2SecurityGroup7.ref, disableExport: true })
new cdk.Output(this, 'EC2SecurityGroup8Ref', { value: EC2SecurityGroup8.ref, disableExport: true })
new cdk.Output(this, 'EC2SecurityGroup9Ref', { value: EC2SecurityGroup9.ref, disableExport: true })
new cdk.Output(this, 'EC2SecurityGroup10Ref', { value: EC2SecurityGroup10.ref, disableExport: true })
new cdk.Output(this, 'EC2SecurityGroup11Ref', { value: EC2SecurityGroup11.ref, disableExport: true })
new cdk.Output(this, 'ElasticLoadBalancingV2ListenerRuleRef', { value: ElasticLoadBalancingV2ListenerRule.ref, disableExport: true })
new cdk.Output(this, 'ElasticLoadBalancingV2ListenerRule2Ref', { value: ElasticLoadBalancingV2ListenerRule2.ref, disableExport: true })
new cdk.Output(this, 'ElasticLoadBalancingV2ListenerRef', { value: ElasticLoadBalancingV2Listener.ref, disableExport: true })
new cdk.Output(this, 'ElasticLoadBalancingV2LoadBalancerRef', { value: ElasticLoadBalancingV2LoadBalancer.ref, disableExport: true })
new cdk.Output(this, 'ECSServiceRef', { value: ECSService.ref, disableExport: true })
new cdk.Output(this, 'ECSService2Ref', { value: ECSService2.ref, disableExport: true })
new cdk.Output(this, 'ECSService3Ref', { value: ECSService3.ref, disableExport: true })
new cdk.Output(this, 'ECSService4Ref', { value: ECSService4.ref, disableExport: true })
new cdk.Output(this, 'ECSTaskDefinitionRef', { value: ECSTaskDefinition.ref, disableExport: true })
new cdk.Output(this, 'ECSTaskDefinition2Ref', { value: ECSTaskDefinition2.ref, disableExport: true })
new cdk.Output(this, 'ApplicationAutoScalingScalableTargetRef', { value: ApplicationAutoScalingScalableTarget.ref, disableExport: true })
new cdk.Output(this, 'ApplicationAutoScalingScalingPolicyRef', { value: ApplicationAutoScalingScalingPolicy.ref, disableExport: true })
new cdk.Output(this, 'RDSDBParameterGroupRef', { value: RDSDBParameterGroup.ref, disableExport: true })
new cdk.Output(this, 'RDSDBParameterGroup2Ref', { value: RDSDBParameterGroup2.ref, disableExport: true })
new cdk.Output(this, 'RDSOptionGroupRef', { value: RDSOptionGroup.ref, disableExport: true })
new cdk.Output(this, 'RDSOptionGroup2Ref', { value: RDSOptionGroup2.ref, disableExport: true });
    }
}

const app = new cdk.App();

new MyStack(app, 'my-stack-name', { env: { region: 'us-east-2' } });

app.run();
