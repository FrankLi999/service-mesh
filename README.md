An reference app with two micro-services plus mysql on Docker, Openshift and AWS. Micros-services communicate via service mesh on Openshift and AWS.

    logging:
      to console, picked up by EFK on Openshift and ??? on AWS
	tracing:
	  jaeger on Docker/Openshift and x Ray on AWS
	monitor:
	   prometheus/Grafana on Docker/Openshift, ??? on AWS?
	   
	Service mesh:
	   istio on oenshfift and AWS Service Mesh on AWS
	API Gateway:
	   3 Scale on openshift and AWS API Gateway on AWS
	
	
	