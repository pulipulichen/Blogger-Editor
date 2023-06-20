# Dockerhub

- https://docs.docker.com/get-started/04_sharing_app/
- `docker image ls` 找出合適的名稱，例如「blogger-editor_app」
- 建立合適的repo https://hub.docker.com/
- `docker tag blogger-editor_app pudding/node-pwa:blogger-editor-12`
- `docker push pudding/node-pwa:blogger-editor-12`
- 修改Dockerfile 

````
FROM pudding/node-pwa:blogger-editor-12

COPY package.json ./
RUN npm i
````