BASEDIR=$(dirname "$0")
cd "$BASEDIR"
cd ..
docker-compose run app npm run 3.webpack-watch-build-production