# AWS Lambda Application (NodeJS) Boilerplate using SAM CLI

This Boilerplate is Created by Using

1) AWS SAM CLI
2) AWS Cloudformation
3) MySQL
4) JWT
5) Joi Validation
6) Bcrypt




Folder Structure

├── lambdas 
  |── signup                       # every lambda will have its own folder and will be having app.js , service.js and dao.js files inside it
    |──────── app.js
    |──────── service.js
    |──────── dao.js  
  |── login
    |──────── app.js
    |──────── service.js
    |──────── dao.js   
  |── profile
    |──────── app.js
    |──────── service.js
    |──────── dao.js                    

├── shared                    
  ├── code
    |──────── nodes
         |──────── node_modules        # this folder will be having the common code shared throught the application (all lambdas) like utils
                          
  ├── lib
    |──────── nodes
         |──────── package.json   
         |──────── node_modules      # this folder will be having all npm modules used throughout all the lambda functions

├── package.json        # this file is used just for local development purpose to run the start and watch script with cross-env  and nodemon              
└── template.yaml                    # in this file we define our aws resources using cloudformation 


shared/code/nodejs/node_modules/antinoPms_config  is havind creds so it is included in .gitignore file


# Setup Required to Run this Application Locally and Deploy to AWS. 
1) Install AWS CLI
2) Install Docker   # Docker is required to run lambdas locally
3) Install SAM CLI
4) Should have An AWS IAM User having access to S3 Bucket, Cloudformation, Lambda, RDS (if using database from aws), API Gateway
                AmazonAPIGatewayAdministrator
                AmazonAPIGatewayPushToCloudWatchLogs
                AmazonRDSFullAccess
                AmazonAPIGatewayInvokeFullAccess
                AmazonS3FullAccess
                AWSCodeDeployRoleForCloudFormation
                AWSCloudFormationFullAccess
                AWSLambda_FullAccess
                AmazonS3ObjectLambdaExecutionRolePolicy
5) Get the Secret Key and Acces Key of that AWS IAM user
6) Configure AWS CLI- https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html


# How to Run This application Locally
1) install nodemon globally
2) run npm install at root folder of this appliaction to install cross-env
3) run npm install on shared/lib/nodejs path to install npm dependencies
4) 
  a) Changes need to be done [on ubuntu] to connect to local MYSQL 
   - sudo ufw allow 3306   # to open port 3306 from firewall
   - CREATE USER 'root'@'%' IDENTIFIED BY 'PASSWORD';   #in mysql console
   - GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION; # in mysql console
   - FLUSH PRIVILEGES; # in mysql console
   - set bind-address = 0.0.0.0 in /etc/mysql/mysql.conf.d/mysqld.cnf file for mysql version 5.7 and above and in /etc/mysql/my.cnf file  for version 5.6 or below
   - systemctl restart mysql # in regular console to restart mysql server
   - check ip address if docker network interface by command -> 
              ifconfig or hostname -I
      most probably it would be 172.17.0.1
   - put this ip address in mysql connection config 
        "host": "172.17.0.1"

  b) for development also if you are using some cloud Database service  step (a) is not required simple put the details you got from cloud service provider in database config

5) run 'npm run watch' in one terminal , on this terminal nodemon will watch for changes in js,yaml and json files and build the application so we don't have to build the app everytime we make any change in code
6) run 'npm run start' on other terminal, it will start the application and all lambdas will be deployed locally with the help of docker container
    
7) When we change in yaml file we need to stop currently running sam cli (CTRL + C/X) and start again by running 'npm run start'
8) hit localhost:3061/signup [POST] through postman with payload
{
    "firstName":"john",
    "lastName":"doe",
    "email":"user@email.com",
    "password":"12345",
    "role":"user"
}

Create a user with role 'user' and create another user having role 'admin'

9) Login api [POST]
localhost:3061/login

{
    "email":"email",
    "password":"password"
}

10) localhost:3061/profile [GET]
set Bearer token in headers

11) we can change the port from 'start' script in package.json

# Deploy to AWS 

1) change database config details if using Local DB for development
2) 1st time --> 
          a) sam build 
          b) sam deploy --guided
3) afterwards --> sam deploy
          a) sam build 
          b) sam deploy 
4) once deployed successfully login to aws console and go to lambda functions select lambda function go to configuration tab there you will se Api gateway under trigger copy API endpoint that is the api , you can test it with Postman or use it in front end applications like Angular , React etc.

# Share npm modules and common code (util files) with all lambdas

To achieve this We have created 2 Layers
 1) CodeLayer   # this layer is having common util code, middlewares, Schema etc.
 2) LibLayer    # this Layer is having npm modules


 # Import npm modules and common code (util files) with all lambdas
<pre>
   Case (1) -> When Lambdas Deployed on AWS 
               - when deployed to aws we can import both i.e util file and npm modules like below 
                  - const bcrypt =require('bcrypt');  
                  - const roleMiddleware = require('antinoPms_middlewares')
   Case (2) -> When Running on Local 
              When running Locally we needed some workaround so we have set NODE_PATH Environment variable value to 
              1) ./shared/code/nodejs/node_modules 
              and 
              2) ./shared/lib/nodejs/node_modules
              
    in package.json start script. that is why const roleMiddleware = require('antinoPms_middlewares') works fine in local development also.


<pre>