#!/bin/bash

BASEDIR=$(dirname "$0")
cd "$BASEDIR"
cd ..
sudo docker compose build