#!/bin/bash

BASEDIR=$(dirname "$0")
cd "$BASEDIR"
cd ..
sudo docker compose run app npm run 2.webpack-watch-development