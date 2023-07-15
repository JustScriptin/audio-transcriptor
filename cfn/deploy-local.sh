#!/bin/bash

# Set app name 
APP_NAME=audio-transcriptor

# Get the account ID
ACCOUNT_ID=463127288570

# If the command fails, stop the script
if [ $? -ne 0 ]; then
    echo "Error getting AWS account ID. Make sure your AWS credentials are set up correctly."
    exit 1
fi

# Build Docker image
docker build -t $APP_NAME .

# Tag image 
docker tag $APP_NAME:$APP_NAME $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/$APP_NAME:$APP_NAME

# Push image to ECR
docker push $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/$APP_NAME:$APP_NAME

# Deploy CloudFormation stack
aws cloudformation deploy --template-file template.yml --stack-name $APP_NAME --parameter-overrides AppName=$APP_NAME
