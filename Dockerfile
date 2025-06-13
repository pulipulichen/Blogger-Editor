FROM node:20-bullseye

RUN apt-get update
RUN apt-get install -y npm
RUN apt-get update && apt-get install -y python3 make g++

RUN npm install accepts@1.3.7
RUN npm install @babel/runtime@7.27.6
RUN npm install babel-polyfill@6.26.0
RUN npm install cacache@12.0.3
RUN npm install colors-cli@1.0.23
RUN npm install cookie@0.4.0
RUN npm install cross-spawn@6.0.5
RUN npm install dayjs@1.8.12
RUN npm install dayjs-plugin-utc@0.1.2
RUN npm install debug@4.1.1
RUN npm install depd@2.0.0
RUN npm install destroy@1.0.4
RUN npm install detect-browser@4.4.0
RUN npm install encodeurl@1.0.2
RUN npm install escape-html@1.0.3
RUN npm install etag@1.8.1
RUN npm install file-saver@2.0.1
RUN npm install find-cache-dir@3.0.0
RUN npm install fresh@0.5.2
RUN npm install hash-sum@2.0.0
RUN npm install jquery@3.5.0
RUN npm install js-yaml@3.13.1
RUN npm install json5@2.1.0
RUN npm install jszip@3.7.0
RUN npm install jszip-utils@0.0.2
RUN npm install loader-utils@1.4.2
RUN npm install ms@2.1.2
RUN npm install on-finished@2.3.0
RUN npm install open@6.0.0
RUN npm install parseurl@1.3.3
RUN npm install postcss@7.0.36
RUN npm install postcss-value-parser@4.0.2
RUN npm install proxy-addr@2.0.5
RUN npm install qs@6.7.0
RUN npm install range-parser@1.2.1
RUN npm install safe-buffer@5.1.2
RUN npm install safer-buffer@2.1.2
RUN npm install schema-utils@2.2.0
RUN npm install serialize-javascript@3.1.0
RUN npm install source-map@0.7.3
RUN npm install type-is@1.6.18
RUN npm install uglify-js@3.6.0
RUN npm install unpipe@1.0.0
RUN npm install uuid@3.3.2
RUN npm install vue-fragment@1.5.1
RUN npm install vuedraggable@2.23.2
RUN npm install webpack-sources@1.4.3
RUN npm install turndown@7.1.2
RUN npm install turndown-plugin-gfm@1.0.2
RUN npm install markdown-it@13.0.1
RUN npm install markdown-it-multimd-table@4.2.2
RUN npm install he@1.2.0
RUN npm install sql.js@1.13.0

RUN npm install --save-dev @babel/core@7.13.10
RUN npm install --save-dev copy-webpack-plugin@13.0.0
RUN npm install --save-dev @babel/plugin-proposal-object-rest-spread@7.5.5
RUN npm install --save-dev @babel/plugin-transform-runtime@7.13.10
RUN npm install --save-dev @kazupon/vue-i18n-loader@0.4.1
RUN npm install --save-dev @microsoft/loader-raw-script@1.2.151
RUN npm install --save-dev @vue/component-compiler-utils@1.3.1
RUN npm install --save-dev babel-loader@8.0.6
RUN npm install --save-dev css-loader@3.2.0
RUN npm install --save-dev cssnano@4.1.10
RUN npm install --save-dev express@4.17.1
RUN npm install --save-dev file-loader@3.0.1
RUN npm install --save-dev find-free-port@2.0.0
RUN npm install --save-dev jsonfile@5.0.0
RUN npm install --save-dev less@3.9.0
RUN npm install --save-dev less-loader@5.0.0
RUN npm install --save-dev wasm-loader@1.3.0
RUN npm install --save-dev open-browsers@1.1.1
RUN npm install --save-dev optimize-css-assets-webpack-plugin@5.0.1
RUN npm install --save-dev postcss-loader@3.0.0
RUN npm install --save-dev style-loader@0.23.1
RUN npm install --save-dev uglifyjs-webpack-plugin@2.2.0
RUN npm install --save-dev vue@2.6.10
RUN npm install --save-dev vue-i18n@8.10.0
RUN npm install --save-dev vue-loader@15.7.1
RUN npm install --save-dev vue-style-loader@4.1.2
RUN npm install --save-dev vue-template-compiler@2.6.10
RUN npm install --save-dev webpack@5.99.9
RUN npm install --save-dev webpack-bundle-analyzer@3.3.2
RUN npm install --save-dev webpack-cli@6.0.1
RUN npm install --save-dev webpack-shell-plugin@0.5.0
RUN npm install --save-dev @babel/preset-env@7.27.2
RUN npm install --save-dev babel-plugin-transform-runtime@6.23.0

COPY package.json ./
RUN npm i