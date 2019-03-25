/*

"@babel/plugin-proposal-object-rest-spread": "^7.3.4",
    "@babel/preset-env": "^7.3.4",
    "acorn": "^6.1.1",
    "ajv": "^6.10.0",
    "babel-core": "^6.26.3",
    "babel-loader": "^8.0.5",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.7.0",
    "chai": "^4.2.0",
    "cheerio": "^1.0.0-rc.2",
    "codemirror": "^5.45.0",
    "css-loader": "^2.1.0",
    "cssnano": "^4.1.10",
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "html-webpack-plugin": "^3.2.0",
    "jest": "^24.1.0",
    "jest-environment-node": "^24.5.0",
    "jest-environment-selenium": "^2.1.0",
    "jquery": "^3.3.1",
    "json2csv": "^4.3.5",
    "less": "^3.9.0",
    "less-loader": "^4.1.0",
    "mini-css-extract-plugin": "^0.5.0",
    "mocha": "^6.0.2",
    "node-stream-zip": "^1.8.0",
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    "popper": "^1.0.1",
    "postcss-loader": "^3.0.0",
    "preload-webpack-plugin": "^3.0.0-beta.3",
    "selenium-side-runner": "^3.5.9",
    "selenium-webdriver": "^4.0.0-alpha.1",
    "shim-loader": "^1.0.1",
    "should": "^13.2.3",
    "style-loader": "^0.23.1",
    "uglifyjs-webpack-plugin": "^2.1.2",
    "vue-hot-reload-api": "^2.3.3",
    "vue-loader": "^15.7.0",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.2.3",
    "webpack-node-externals": "^1.7.2",
    "webpack-shell-plugin": "^0.5.0"

*/

let c = {
"@babel/plugin-proposal-object-rest-spread": "^7.3.4",
    "@babel/preset-env": "^7.3.4",
    "acorn": "^6.1.1",
    "ajv": "^6.10.0",
    "babel-core": "^6.26.3",
    "babel-loader": "^8.0.5",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.7.0",
    "chai": "^4.2.0",
    "cheerio": "^1.0.0-rc.2",
    "codemirror": "^5.45.0",
    "css-loader": "^2.1.0",
    "cssnano": "^4.1.10",
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "html-webpack-plugin": "^3.2.0",
    "jest": "^24.1.0",
    "jest-environment-node": "^24.5.0",
    "jest-environment-selenium": "^2.1.0",
    "jquery": "^3.3.1",
    "json2csv": "^4.3.5",
    "less": "^3.9.0",
    "less-loader": "^4.1.0",
    "mini-css-extract-plugin": "^0.5.0",
    "mocha": "^6.0.2",
    "node-stream-zip": "^1.8.0",
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    "popper": "^1.0.1",
    "postcss-loader": "^3.0.0",
    "preload-webpack-plugin": "^3.0.0-beta.3",
    "selenium-side-runner": "^3.5.9",
    "selenium-webdriver": "^4.0.0-alpha.1",
    "shim-loader": "^1.0.1",
    "should": "^13.2.3",
    "style-loader": "^0.23.1",
    "uglifyjs-webpack-plugin": "^2.1.2",
    "vue-hot-reload-api": "^2.3.3",
    "vue-loader": "^15.7.0",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.2.3",
    "webpack-node-externals": "^1.7.2",
    "webpack-shell-plugin": "^0.5.0"
}
let a = ["install", "-g"]

let s = []
for (let p in c) {
	a.push(p)
}

s.push({
	command: "npm",
	args: a
})

//console.log(a)

require('package-script').spawn(s);
