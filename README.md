An reference app with two micro-services plus mysql on Docker, Openshift and AWS. Micros-services communicate via service mesh on Openshift and AWS.

    logging:
      logged to stdout, 
	  picked up by EFK on Openshift,
	  glue AWS logging to stdout
	  
	  AWS Fargate:
	     define log groups in task definitions.
		 
		 Each task has a cooresponding log group, each sprng boot app/container has a corresponding 
		 log stream
	  AWS Beanstalk:
	  AWS EC2:
	       have an environment acronym (“dev-”, “test-”, “perf-”, “qa-”, “prod-”…) in all Log Groups. 
		   
		   
		   Then we have three Log Groups in every environment:
			1. One Log Group for each instance: this log group comprises of Log Stream per every individual application instance. 
				This is the “projectX-app1-instance” section in the screenshot.
			2. One Log Group to merge logs from applications belonging to the same AWS Autoscaling Group — 
			   you might be interested to look logs of certain application regardless of the EC2 instance the 
			   application is running on. This is the “projectX-app1-asg” section in the screenshot.
			3. One Log Group which merges every single application instance of every autoscaling group to one 
			   big Log Stream — this Log Stream can be configured to be watched for warnings and errors that 
			   happen anywhere in the system. This is the “projectX-app1-merged” section in the screenshot.

	  We are using Packer / Ansible to bake AMIs. So, you just add instruction to Ansible configuration to 
	  install awslogs package to the Linux AMI. And another configuration to start the AWS Logs as a service 
	  in the EC2 boot.
	  
	  https://medium.com/tieto-developers/how-to-do-application-logging-in-aws-745114ac6eb7
	  https://dzone.com/articles/logging-to-aws-cloudwatch-logs,
	    Log Groups and Log Streams
		
	tracing:
	  NOTE: with Service Mesh in place, the Service Mesh sidecard takes care of distributed request tracing, this reduces
	        the need to update application code to add those tracings.
	 
	  jaeger/kiali on Docker/Openshift 
	  
	  x Ray on AWS/https://github.com/aws/aws-xray-daemon, note, with AWS app mesh in place, 
	  there is not need of code change for x ray,
	  
	  
	     aws-xray-daemon docker image:
		   amazon/aws-xray-daemon:1
	monitor:
	   prometheus/Grafana on Docker/Openshift, Cloudwatch on AWS
	       https://dzone.com/articles/spring-boot-metrics-with-micrometer-and-aws-cloudw
	   
	Service mesh:
	   istio on oenshfift and AWS Service Mesh on AWS
	
	API Gateway:
	   3 Scale on openshift and AWS API Gateway on AWS
	   
	Configiration
	   config map on openshift, Parameter store/System Manager on AWS
	Secrect:
	   Secrest on openshift, AWS Secrets Manager/System Manager on AWS
	
	
	