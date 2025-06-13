FROM pudding/node-pwa:blogger-editor-12

COPY package.json ./
RUN npm i