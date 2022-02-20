BASEDIR=$(dirname "$0")
cd "$BASEDIR"
cd ..
docker-compose run app npm run 2.webpack-watch-development