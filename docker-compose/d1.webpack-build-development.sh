#!/bin/bash

BASEDIR=$(dirname "$0")
cd "$BASEDIR"
cd ..
sudo docker compose run app npm run 1.webpack-build-development