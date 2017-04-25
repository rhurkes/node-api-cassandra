#!/bin/bash

# Removes images
docker rmi $(docker images -f "dangling=true" -q)

# Removes containers
docker rm `docker ps --no-trunc -aq`
