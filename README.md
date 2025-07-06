# Chronic Kidney Disease Tool  

This chronic kidney disease tool aims to help patients and clinicians determine the current stage of kidney disease.  

## Application Deployment  

When you're ready, start your application by running:  
`docker compose up --build`  

To deploy to the cloud:  
1. First build your image:  
`docker build -t myapp .`  
If your cloud uses a different CPU architecture than your development machine (e.g., you are on a Mac M1 and your cloud provider is amd64), build for that platform instead:  
`docker build --platform=linux/amd64 -t myapp .`  

2. Then push it to your registry:  
`docker push myregistry.com/myapp`  

For more details see Docker's documentation about building and pushing images.
