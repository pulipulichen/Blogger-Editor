BASEDIR=$(dirname "$0")
cd "$BASEDIR"
cd ..
docker-compose run app npm run 1.webpack-build-development