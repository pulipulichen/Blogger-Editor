BASEDIR=$(dirname "$0")
cd "$BASEDIR"
cd ..
docker-compose run app npm run 4.webpack-build-production