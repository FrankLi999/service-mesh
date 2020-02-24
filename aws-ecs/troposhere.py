# pip install troposphere

from troposphere import ec2, ecs, rds, elasticloadbalancingv2, applicationautoscaling
from troposphere import Ref, GetAtt, Template

template = Template()

template.add_version("2010-09-09")

EC2Instance = template.add_resource(ec2.Instance(
    'EC2Instance',
    ImageId='ami-0e38b48473ea57778',
    InstanceType='t2.micro',
    KeyName='my_ecs',
    AvailabilityZone='us-east-2a',
    Tenancy='default',
    SubnetId='subnet-08d3101feec0e17da',
    EbsOptimized=False,
    SecurityGroupIds=[
        'sg-0e73dfed1e85cb46e'
    ],
    SourceDestCheck=True,
    BlockDeviceMappings=[
        ec2.BlockDeviceMapping(
            DeviceName='/dev/xvda',
            Ebs=ec2.EBSBlockDevice(
                Encrypted=False,
                VolumeSize=8,
                SnapshotId='snap-0ed4f88be6558a32a',
                VolumeType='gp2',
                DeleteOnTermination=True
            )
        )
    ],
    HibernationOptions={
        "Configured": False
    }
))

ECSCluster = template.add_resource(ecs.Cluster(
    'ECSCluster',
    ClusterName='default',
    ClusterSettings=[
        {
            "Name": 'containerInsights',
            "Value": 'disabled'
        }
    ]
))

RDSDBInstance = template.add_resource(rds.DBInstance(
    'RDSDBInstance',
    DBInstanceIdentifier='wcmbpm',
    AllocatedStorage=20,
    DBInstanceClass='db.t2.micro',
    Engine='mysql',
    MasterUsername='admin',
    MasterUserPassword='REPLACEME',
    PreferredBackupWindow='07:30-08:00',
    BackupRetentionPeriod=7,
    AvailabilityZone='us-east-2b',
    PreferredMaintenanceWindow='mon:06:04-mon:06:34',
    MultiAZ=False,
    EngineVersion='5.7.22',
    AutoMinorVersionUpgrade=True,
    LicenseModel='general-public-license',
    PubliclyAccessible=True,
    StorageType='gp2',
    Port=3306,
    StorageEncrypted=False,
    CopyTagsToSnapshot=True,
    MonitoringInterval=0,
    EnableIAMDatabaseAuthentication=False,
    EnablePerformanceInsights=False,
    DeletionProtection=False,
    DBSubnetGroupName='default-vpc-0e12e822c1e5549cf',
    VPCSecurityGroups=[
        'sg-06b6268a569621a85'
    ],
    MaxAllocatedStorage=1000,
    DBParameterGroupName='default.mysql5.7',
    OptionGroupName='default:mysql-5-7',
    CACertificateIdentifier='rds-ca-2019'
))

RDSDBSubnetGroup = template.add_resource(rds.DBSubnetGroup(
    'RDSDBSubnetGroup',
    DBSubnetGroupDescription='Created from the RDS Management Console',
    DBSubnetGroupName='default-vpc-0e12e822c1e5549cf',
    SubnetIds=[
        'subnet-08d3101feec0e17da',
        'subnet-0c86eeb5d3ab2e031'
    ]
))

RDSDBSecurityGroup = template.add_resource(rds.DBSecurityGroup(
    'RDSDBSecurityGroup',
    GroupDescription=Ref(ECSCluster)
))

EC2SecurityGroup = template.add_resource(ec2.SecurityGroup(
    'EC2SecurityGroup',
    GroupDescription='2020-02-23T21:47:44.823Z',
    GroupName='ws-cur-1498',
    VpcId='vpc-0e12e822c1e5549cf',
    SecurityGroupIngress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=80,
            IpProtocol='tcp',
            ToPort=80
        ),
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=8100,
            IpProtocol='tcp',
            ToPort=8100
        )
    ],
    SecurityGroupEgress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            IpProtocol='-1'
        )
    ]
))

EC2SecurityGroup2 = template.add_resource(ec2.SecurityGroup(
    'EC2SecurityGroup2',
    GroupDescription='load-balancer-wizard-1 created on 2020-02-23T17:50:36.218-05:00',
    GroupName='my-service-lb-sg',
    VpcId='vpc-0e12e822c1e5549cf',
    SecurityGroupIngress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=80,
            IpProtocol='tcp',
            ToPort=80
        ),
        ec2.SecurityGroupRule(
            CidrIpv6='::/0',
            FromPort=80,
            IpProtocol='tcp',
            ToPort=80
        )
    ],
    SecurityGroupEgress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            IpProtocol='-1'
        )
    ]
))

EC2SecurityGroup3 = template.add_resource(ec2.SecurityGroup(
    'EC2SecurityGroup3',
    GroupDescription='2020-02-23T21:54:13.567Z',
    GroupName='ws-cur-4246',
    VpcId='vpc-0e12e822c1e5549cf',
    SecurityGroupIngress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=80,
            IpProtocol='tcp',
            ToPort=80
        ),
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=8100,
            IpProtocol='tcp',
            ToPort=8100
        ),
        ec2.SecurityGroupRule(
            CidrIpv6='::/0',
            Description='',
            FromPort=8100,
            IpProtocol='tcp',
            ToPort=8100
        )
    ],
    SecurityGroupEgress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            IpProtocol='-1'
        )
    ]
))

EC2SecurityGroup4 = template.add_resource(ec2.SecurityGroup(
    'EC2SecurityGroup4',
    GroupDescription='launch-wizard-1 created 2020-02-23T17:00:57.669-05:00',
    GroupName='launch-wizard-1',
    VpcId='vpc-0e12e822c1e5549cf',
    SecurityGroupIngress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=22,
            IpProtocol='tcp',
            ToPort=22
        )
    ],
    SecurityGroupEgress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            IpProtocol='-1'
        )
    ]
))

EC2SecurityGroup5 = template.add_resource(ec2.SecurityGroup(
    'EC2SecurityGroup5',
    GroupDescription='default VPC security group',
    GroupName=Ref(ECSCluster),
    VpcId='vpc-0e12e822c1e5549cf',
    SecurityGroupIngress=[
        ec2.SecurityGroupRule(
            SourceSecurityGroupId='sg-03edaec6c9ff603a8',
            SourceSecurityGroupOwnerId='445114057331',
            IpProtocol='-1'
        )
    ],
    SecurityGroupEgress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            IpProtocol='-1'
        )
    ]
))

EC2SecurityGroup6 = template.add_resource(ec2.SecurityGroup(
    'EC2SecurityGroup6',
    GroupDescription='Created by RDS management console',
    GroupName='sg_mysql',
    VpcId='vpc-0e12e822c1e5549cf',
    SecurityGroupIngress=[
        ec2.SecurityGroupRule(
            CidrIp='162.211.184.9/32',
            FromPort=GetAtt(RDSDBInstance, 'Endpoint.Port'),
            IpProtocol='tcp',
            ToPort=GetAtt(RDSDBInstance, 'Endpoint.Port')
        )
    ],
    SecurityGroupEgress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            IpProtocol='-1'
        )
    ]
))

EC2SecurityGroup7 = template.add_resource(ec2.SecurityGroup(
    'EC2SecurityGroup7',
    GroupDescription='2020-02-23T21:41:00.306Z',
    GroupName='ws-cur-477',
    VpcId='vpc-0e12e822c1e5549cf',
    SecurityGroupIngress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=80,
            IpProtocol='tcp',
            ToPort=80
        ),
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=8100,
            IpProtocol='tcp',
            ToPort=8100
        )
    ],
    SecurityGroupEgress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            IpProtocol='-1'
        )
    ]
))

EC2SecurityGroup8 = template.add_resource(ec2.SecurityGroup(
    'EC2SecurityGroup8',
    GroupDescription='2020-02-23T22:54:20.543Z',
    GroupName='ws-cur-6874',
    VpcId='vpc-0e12e822c1e5549cf',
    SecurityGroupIngress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=80,
            IpProtocol='tcp',
            ToPort=80
        ),
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=8000,
            IpProtocol='tcp',
            ToPort=8000
        )
    ],
    SecurityGroupEgress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            IpProtocol='-1'
        )
    ]
))

EC2SecurityGroup9 = template.add_resource(ec2.SecurityGroup(
    'EC2SecurityGroup9',
    GroupDescription='2020-02-23T21:04:34.777Z',
    GroupName='ws-cur-2621',
    VpcId='vpc-0e12e822c1e5549cf',
    SecurityGroupIngress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=80,
            IpProtocol='tcp',
            ToPort=80
        ),
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            Description='',
            FromPort=8000,
            IpProtocol='tcp',
            ToPort=8000
        ),
        ec2.SecurityGroupRule(
            CidrIpv6='::/0',
            Description='',
            FromPort=8000,
            IpProtocol='tcp',
            ToPort=8000
        )
    ],
    SecurityGroupEgress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            IpProtocol='-1'
        )
    ]
))

EC2SecurityGroup10 = template.add_resource(ec2.SecurityGroup(
    'EC2SecurityGroup10',
    GroupDescription='2020-02-23T21:07:09.230Z',
    GroupName='aws-cu-2871',
    VpcId='vpc-0e12e822c1e5549cf',
    SecurityGroupIngress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=80,
            IpProtocol='tcp',
            ToPort=80
        ),
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=8100,
            IpProtocol='tcp',
            ToPort=8100
        ),
        ec2.SecurityGroupRule(
            CidrIpv6='::/0',
            Description='',
            FromPort=8100,
            IpProtocol='tcp',
            ToPort=8100
        )
    ],
    SecurityGroupEgress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            IpProtocol='-1'
        )
    ]
))

EC2SecurityGroup11 = template.add_resource(ec2.SecurityGroup(
    'EC2SecurityGroup11',
    GroupDescription='2020-02-23T21:36:03.493Z',
    GroupName='ws-cur-3908',
    VpcId='vpc-0e12e822c1e5549cf',
    SecurityGroupIngress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=80,
            IpProtocol='tcp',
            ToPort=80
        ),
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            FromPort=8000,
            IpProtocol='tcp',
            ToPort=8000
        ),
        ec2.SecurityGroupRule(
            CidrIpv6='::/0',
            Description='',
            FromPort=8000,
            IpProtocol='tcp',
            ToPort=8000
        )
    ],
    SecurityGroupEgress=[
        ec2.SecurityGroupRule(
            CidrIp='0.0.0.0/0',
            IpProtocol='-1'
        )
    ]
))

ElasticLoadBalancingV2ListenerRule = template.add_resource(elasticloadbalancingv2.ListenerRule(
    'ElasticLoadBalancingV2ListenerRule',
    Priority='1',
    ListenerArn='arn:aws:elasticloadbalancing:us-east-2:445114057331:listener/app/my-service-lb/39baed772591d6c0/930c98eb2dcb4690',
    Conditions=[
        elasticloadbalancingv2.Condition(
            Field='path-pattern',
            Values=[
                '/api/currency-exchange-microservice/*'
            ]
        )
    ],
    Actions=[
        elasticloadbalancingv2.Action(
            Type='forward',
            TargetGroupArn='arn:aws:elasticloadbalancing:us-east-2:445114057331:targetgroup/currencyexchangeservicetg/1d71df4075d5ad16',
            ForwardConfig={
                "TargetGroups": [
                    {
                        'TargetGroupArn': 'arn:aws:elasticloadbalancing:us-east-2:445114057331:targetgroup/currencyexchangeservicetg/1d71df4075d5ad16',
                        'Weight': 1
                    }
                ],
                "TargetGroupStickinessConfig": {
                    'Enabled': False
                }
            }
        )
    ]
))

ElasticLoadBalancingV2ListenerRule2 = template.add_resource(elasticloadbalancingv2.ListenerRule(
    'ElasticLoadBalancingV2ListenerRule2',
    Priority='2',
    ListenerArn='arn:aws:elasticloadbalancing:us-east-2:445114057331:listener/app/my-service-lb/39baed772591d6c0/930c98eb2dcb4690',
    Conditions=[
        elasticloadbalancingv2.Condition(
            Field='path-pattern',
            Values=[
                '/api/currency-conversion-microservice/*'
            ]
        )
    ],
    Actions=[
        elasticloadbalancingv2.Action(
            Type='forward',
            TargetGroupArn='arn:aws:elasticloadbalancing:us-east-2:445114057331:targetgroup/currencyconversiontg/88d30716639bff38',
            ForwardConfig={
                "TargetGroups": [
                    {
                        'TargetGroupArn': 'arn:aws:elasticloadbalancing:us-east-2:445114057331:targetgroup/currencyconversiontg/88d30716639bff38',
                        'Weight': 1
                    }
                ],
                "TargetGroupStickinessConfig": {
                    'Enabled': False
                }
            }
        )
    ]
))

ElasticLoadBalancingV2Listener = template.add_resource(elasticloadbalancingv2.Listener(
    'ElasticLoadBalancingV2Listener',
    LoadBalancerArn='arn:aws:elasticloadbalancing:us-east-2:445114057331:loadbalancer/app/my-service-lb/39baed772591d6c0',
    Port=80,
    Protocol='HTTP',
    DefaultActions=[
        elasticloadbalancingv2.Action(
            TargetGroupArn='arn:aws:elasticloadbalancing:us-east-2:445114057331:targetgroup/myservicetg/1e7ac7298d055281',
            Type='forward'
        )
    ]
))

ElasticLoadBalancingV2LoadBalancer = template.add_resource(elasticloadbalancingv2.LoadBalancer(
    'ElasticLoadBalancingV2LoadBalancer',
    Name='my-service-lb',
    Scheme='internet-facing',
    Type='application',
    Subnets=[
        'subnet-08d3101feec0e17da',
        'subnet-0c86eeb5d3ab2e031'
    ],
    SecurityGroups=[
        Ref(EC2SecurityGroup2)
    ],
    IpAddressType='ipv4',
    LoadBalancerAttributes=[
        elasticloadbalancingv2.LoadBalancerAttributes(
            Key='access_logs.s3.enabled',
            Value='false'
        ),
        elasticloadbalancingv2.LoadBalancerAttributes(
            Key='idle_timeout.timeout_seconds',
            Value='60'
        ),
        elasticloadbalancingv2.LoadBalancerAttributes(
            Key='deletion_protection.enabled',
            Value='false'
        ),
        elasticloadbalancingv2.LoadBalancerAttributes(
            Key='routing.http2.enabled',
            Value='true'
        ),
        elasticloadbalancingv2.LoadBalancerAttributes(
            Key='routing.http.drop_invalid_header_fields.enabled',
            Value='false'
        )
    ]
))

ECSService = template.add_resource(ecs.Service(
    'ECSService',
    ServiceName='ws-currency-exchange-service-h2-appmesh',
    Cluster=GetAtt(ECSCluster, 'Arn'),
    ServiceRegistries=[
        ecs.ServiceRegistry(
            RegistryArn='arn:aws:servicediscovery:us-east-2:445114057331:service/srv-yv4x7pmjmrx6kehz'
        )
    ],
    DesiredCount=1,
    LaunchType='FARGATE',
    PlatformVersion='LATEST',
    TaskDefinition='arn:aws:ecs:us-east-2:445114057331:task-definition/aws-currency-exchange-service-h2-xray:3',
    DeploymentConfiguration=ecs.DeploymentConfiguration(
        MaximumPercent=200,
        MinimumHealthyPercent=100
    ),
    Role='arn:aws:iam::445114057331:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS',
    NetworkConfiguration=ecs.NetworkConfiguration(
        AwsvpcConfiguration=ecs.AwsvpcConfiguration(
            AssignPublicIp='ENABLED',
            SecurityGroups=[
                Ref(EC2SecurityGroup11)
            ],
            Subnets=[
                'subnet-0c86eeb5d3ab2e031',
                'subnet-08d3101feec0e17da'
            ]
        )
    ),
    SchedulingStrategy='REPLICA'
))

ECSService2 = template.add_resource(ecs.Service(
    'ECSService2',
    ServiceName='ws-currency-conversion-services-appmesh',
    Cluster=GetAtt(ECSCluster, 'Arn'),
    ServiceRegistries=[
        ecs.ServiceRegistry(
            RegistryArn='arn:aws:servicediscovery:us-east-2:445114057331:service/srv-z32i4oh6oq4j4tg2'
        )
    ],
    DesiredCount=1,
    LaunchType='FARGATE',
    PlatformVersion='LATEST',
    TaskDefinition='arn:aws:ecs:us-east-2:445114057331:task-definition/aws-currency-conversion-service-xray:5',
    DeploymentConfiguration=ecs.DeploymentConfiguration(
        MaximumPercent=200,
        MinimumHealthyPercent=100
    ),
    Role='arn:aws:iam::445114057331:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS',
    NetworkConfiguration=ecs.NetworkConfiguration(
        AwsvpcConfiguration=ecs.AwsvpcConfiguration(
            AssignPublicIp='ENABLED',
            SecurityGroups=[
                Ref(EC2SecurityGroup3)
            ],
            Subnets=[
                'subnet-0c86eeb5d3ab2e031',
                'subnet-08d3101feec0e17da'
            ]
        )
    ),
    SchedulingStrategy='REPLICA'
))

ECSService3 = template.add_resource(ecs.Service(
    'ECSService3',
    ServiceName='ws-currency-exchange-service-h2-lb',
    Cluster=GetAtt(ECSCluster, 'Arn'),
    LoadBalancers=[
        ecs.LoadBalancer(
            TargetGroupArn='arn:aws:elasticloadbalancing:us-east-2:445114057331:targetgroup/currencyexchangeservicetg/1d71df4075d5ad16',
            ContainerName='aws-currency-exchange-service-h2-xray',
            ContainerPort=8000
        )
    ],
    ServiceRegistries=[
        ecs.ServiceRegistry(
            RegistryArn='arn:aws:servicediscovery:us-east-2:445114057331:service/srv-yv4x7pmjmrx6kehz'
        )
    ],
    DesiredCount=1,
    LaunchType='FARGATE',
    PlatformVersion='LATEST',
    TaskDefinition='arn:aws:ecs:us-east-2:445114057331:task-definition/aws-currency-exchange-service-h2-xray:3',
    DeploymentConfiguration=ecs.DeploymentConfiguration(
        MaximumPercent=200,
        MinimumHealthyPercent=100
    ),
    Role='arn:aws:iam::445114057331:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS',
    NetworkConfiguration=ecs.NetworkConfiguration(
        AwsvpcConfiguration=ecs.AwsvpcConfiguration(
            AssignPublicIp='ENABLED',
            SecurityGroups=[
                Ref(EC2SecurityGroup8)
            ],
            Subnets=[
                'subnet-0c86eeb5d3ab2e031',
                'subnet-08d3101feec0e17da'
            ]
        )
    ),
    HealthCheckGracePeriodSeconds=120,
    SchedulingStrategy='REPLICA'
))

ECSService4 = template.add_resource(ecs.Service(
    'ECSService4',
    ServiceName='ws-currency-conversion-service-lb',
    Cluster=GetAtt(ECSCluster, 'Arn'),
    LoadBalancers=[
        ecs.LoadBalancer(
            TargetGroupArn='arn:aws:elasticloadbalancing:us-east-2:445114057331:targetgroup/currencyconversiontg/88d30716639bff38',
            ContainerName='aws-currency-conversion-service-xray',
            ContainerPort=8100
        )
    ],
    ServiceRegistries=[
        ecs.ServiceRegistry(
            RegistryArn='arn:aws:servicediscovery:us-east-2:445114057331:service/srv-z32i4oh6oq4j4tg2'
        )
    ],
    DesiredCount=1,
    LaunchType='FARGATE',
    PlatformVersion='LATEST',
    TaskDefinition='arn:aws:ecs:us-east-2:445114057331:task-definition/aws-currency-conversion-service-xray:5',
    DeploymentConfiguration=ecs.DeploymentConfiguration(
        MaximumPercent=200,
        MinimumHealthyPercent=100
    ),
    Role='arn:aws:iam::445114057331:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS',
    NetworkConfiguration=ecs.NetworkConfiguration(
        AwsvpcConfiguration=ecs.AwsvpcConfiguration(
            AssignPublicIp='ENABLED',
            SecurityGroups=[
                'sg-031ff400fc9c0987f'
            ],
            Subnets=[
                'subnet-0c86eeb5d3ab2e031',
                'subnet-08d3101feec0e17da'
            ]
        )
    ),
    HealthCheckGracePeriodSeconds=120,
    SchedulingStrategy='REPLICA'
))

ECSTaskDefinition = template.add_resource(ecs.TaskDefinition(
    'ECSTaskDefinition',
    ContainerDefinitions=[
        ecs.ContainerDefinition(
            Essential=True,
            Image='xli9999/aws-currency-exchange-service-h2-xray:0.0.1-SNAPSHOT',
            LogConfiguration=ecs.LogConfiguration(
                LogDriver='awslogs',
                Options={
                    "awslogs-group": '/ecs/aws-currency-exchange-service-h2-xray',
                    "awslogs-region": 'us-east-2',
                    "awslogs-stream-prefix": 'ecs'
                }
            ),
            Name='aws-currency-exchange-service-h2-xray',
            PortMappings=[
                ecs.PortMapping(
                    ContainerPort=8000,
                    HostPort=8000,
                    Protocol='tcp'
                )
            ]
        ),
        ecs.ContainerDefinition(
            Environment=[
                ecs.Environment(
                    Name='APPMESH_VIRTUAL_NODE_NAME',
                    Value='mesh/my-service-mesh/virtualNode/currency-exchange-service-vn'
                ),
                ecs.Environment(
                    Name='ENABLE_ENVOY_XRAY_TRACING',
                    Value='1'
                ),
                ecs.Environment(
                    Name='ENVOY_LOG_LEVEL',
                    Value='trace'
                )
            ],
            Essential=True,
            HealthCheck=ecs.HealthCheck(
                Command=[
                    'CMD-SHELL',
                    'curl -s http://localhost:9901/server_info | grep state | grep -q LIVE'
                ],
                Interval=5,
                Timeout=2,
                Retries=3,
                StartPeriod=10
            ),
            Image='840364872350.dkr.ecr.us-west-2.amazonaws.com/aws-appmesh-envoy:v1.12.1.0-prod',
            LogConfiguration=ecs.LogConfiguration(
                LogDriver='awslogs',
                Options={
                    "awslogs-group": '/ecs/aws-currency-exchange-service-h2-xray',
                    "awslogs-region": 'us-east-2',
                    "awslogs-stream-prefix": 'ecs'
                }
            ),
            Memory=500,
            Name='envoy',
            User='1337'
        ),
        ecs.ContainerDefinition(
            Essential=True,
            Image='amazon/aws-xray-daemon:1',
            LogConfiguration=ecs.LogConfiguration(
                LogDriver='awslogs',
                Options={
                    "awslogs-group": '/ecs/aws-currency-exchange-service-h2-xray',
                    "awslogs-region": 'us-east-2',
                    "awslogs-stream-prefix": 'ecs'
                }
            ),
            Name='xray'
        )
    ],
    Family='aws-currency-exchange-service-h2-xray',
    TaskRoleArn='arn:aws:iam::445114057331:role/ecsTaskExecutionRole',
    ExecutionRoleArn='arn:aws:iam::445114057331:role/ecsTaskExecutionRole',
    NetworkMode='awsvpc',
    RequiresCompatibilities=[
        'FARGATE'
    ],
    Cpu='512',
    Memory='1024'
))

ECSTaskDefinition2 = template.add_resource(ecs.TaskDefinition(
    'ECSTaskDefinition2',
    ContainerDefinitions=[
        ecs.ContainerDefinition(
            Essential=True,
            Image='xli9999/aws-currency-conversion-service-xray:0.0.1-SNAPSHOT',
            LogConfiguration=ecs.LogConfiguration(
                LogDriver='awslogs',
                Options={
                    "awslogs-group": '/ecs/aws-currency-conversion-service-xray',
                    "awslogs-region": 'us-east-2',
                    "awslogs-stream-prefix": 'ecs'
                }
            ),
            Name='aws-currency-conversion-service-xray',
            PortMappings=[
                ecs.PortMapping(
                    ContainerPort=8100,
                    HostPort=8100,
                    Protocol='tcp'
                )
            ],
            Secrets=[
                {
                    "Name": 'CURRENCY_EXCHANGE_URI',
                    "ValueFrom": 'arn:aws:ssm:us-east-2:445114057331:parameter/dev/aws-currency-conversion-service-xray/CURRENCY_EXCHANGE_URI'
                }
            ]
        ),
        ecs.ContainerDefinition(
            Environment=[
                ecs.Environment(
                    Name='APPMESH_VIRTUAL_NODE_NAME',
                    Value='mesh/my-service-mesh/virtualNode/currency-conversion-services-vn'
                ),
                ecs.Environment(
                    Name='ENABLE_ENVOY_XRAY_TRACING',
                    Value='1'
                ),
                ecs.Environment(
                    Name='ENVOY_LOG_LEVEL',
                    Value='trace'
                )
            ],
            Essential=True,
            HealthCheck=ecs.HealthCheck(
                Command=[
                    'CMD-SHELL',
                    'curl -s http://localhost:9901/server_info | grep state | grep -q LIVE'
                ],
                Interval=5,
                Timeout=2,
                Retries=3,
                StartPeriod=10
            ),
            Image='840364872350.dkr.ecr.us-west-2.amazonaws.com/aws-appmesh-envoy:v1.12.1.0-prod',
            LogConfiguration=ecs.LogConfiguration(
                LogDriver='awslogs',
                Options={
                    "awslogs-group": '/ecs/aws-currency-conversion-service-xray',
                    "awslogs-region": 'us-east-2',
                    "awslogs-stream-prefix": 'ecs'
                }
            ),
            Memory=500,
            Name='envoy',
            User='1337'
        ),
        ecs.ContainerDefinition(
            Essential=True,
            Image='amazon/aws-xray-daemon:1',
            LogConfiguration=ecs.LogConfiguration(
                LogDriver='awslogs',
                Options={
                    "awslogs-group": '/ecs/aws-currency-conversion-service-xray',
                    "awslogs-region": 'us-east-2',
                    "awslogs-stream-prefix": 'ecs'
                }
            ),
            Name='xray',
            PortMappings=[
                ecs.PortMapping(
                    ContainerPort=2000,
                    HostPort=2000,
                    Protocol='udp'
                )
            ]
        )
    ],
    Family='aws-currency-conversion-service-xray',
    TaskRoleArn='arn:aws:iam::445114057331:role/ecsTaskExecutionRole',
    ExecutionRoleArn='arn:aws:iam::445114057331:role/ecsTaskExecutionRole',
    NetworkMode='awsvpc',
    RequiresCompatibilities=[
        'FARGATE'
    ],
    Cpu='512',
    Memory='1024'
))

ApplicationAutoScalingScalableTarget = template.add_resource(applicationautoscaling.ScalableTarget(
    'ApplicationAutoScalingScalableTarget',
    MaxCapacity=2,
    MinCapacity=1,
    ResourceId='service/default/ws-currency-conversion-service-lb',
    RoleARN='arn:aws:iam::445114057331:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService',
    ScalableDimension='ecs:service:DesiredCount',
    ServiceNamespace='ecs'
))

ApplicationAutoScalingScalingPolicy = template.add_resource(applicationautoscaling.ScalingPolicy(
    'ApplicationAutoScalingScalingPolicy',
    PolicyName='conversion_service_policy',
    PolicyType='TargetTrackingScaling',
    ResourceId='service/default/ws-currency-conversion-service-lb',
    ScalableDimension='ecs:service:DesiredCount',
    ServiceNamespace='ecs',
    TargetTrackingScalingPolicyConfiguration=applicationautoscaling.TargetTrackingScalingPolicyConfiguration(
        PredefinedMetricSpecification=applicationautoscaling.PredefinedMetricSpecification(
            PredefinedMetricType='ECSServiceAverageCPUUtilization'
        ),
        ScaleInCooldown=300,
        ScaleOutCooldown=300,
        TargetValue=70
    )
))

RDSDBParameterGroup = template.add_resource(rds.DBParameterGroup(
    'RDSDBParameterGroup',
    Description='Default parameter group for mysql5.7',
    Family='mysql5.7'
))

RDSDBParameterGroup2 = template.add_resource(rds.DBParameterGroup(
    'RDSDBParameterGroup2',
    Description='Default parameter group for mysql8.0',
    Family='mysql8.0'
))

RDSOptionGroup = template.add_resource(rds.OptionGroup(
    'RDSOptionGroup',
    EngineName='mysql',
    MajorEngineVersion='5.7',
    OptionGroupDescription='Default option group for mysql 5.7'
))

RDSOptionGroup2 = template.add_resource(rds.OptionGroup(
    'RDSOptionGroup2',
    EngineName='mysql',
    MajorEngineVersion='8.0',
    OptionGroupDescription='Default option group for mysql 8.0'
))

print(template.to_yaml())
