#!/usr/bin/env bash

PROJECT_ROOT="/home/ubuntu/app"
APP_NAME="project"

TIME_NOW=$(date +%c)
cd $PROJECT_ROOT
cp ../.env ./
chmod +x /home/ubuntu/app/scripts/start.sh
pm2 delete $APP_NAME
pm2 start npm --name $APP_NAME -- run start:prod

echo "$TIME_NOW > Deploy has been completed"