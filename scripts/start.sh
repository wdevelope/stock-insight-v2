#!/usr/bin/env bash

PROJECT_ROOT="/home/ubuntu/app"
APP_NAME="project"

TIME_NOW=$(date +%c)

cd $PROJECT_ROOT
cp ../.env ./
sudo pm2 delete $APP_NAME
sudo pm2 start npm --name $APP_NAME -- run start:prod

echo "$TIME_NOW > Deploy has been completed"