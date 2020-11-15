#!/bin/sh

docker system prune
docker image prune -a
docker volume prune