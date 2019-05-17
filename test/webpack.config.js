const path = require('path')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
//const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const ExtractTextPlugin = require("extract-text-webpack-plugin")
const WebpackShellPlugin = require('webpack-shell-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const VueLoaderPlugin = require('vue-loader/lib/plugin');

let compileCount = 0

module.exports = (env, argv) => {
  //console.log(argv.mode)
  
  let webpackConfig = {
    //cache: false,
    devtool: 'source-map',
    //devtool: false,
    entry: {
      //'test': './[tmp/test.js',
      'test': './test/src/index.js',
    },
    output: {
      path: path.resolve('./test/dist/'),
      filename: '[name].min.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/, // 針對所有.css 的檔案作預處理，這邊是用 regular express 的格式
          use: [
            'vue-style-loader', // 這個會後執行 (順序很重要)
            'css-loader?sourceMap', // 這個會先執行
            //'postcss-loader?sourceMap',
          ]
        },
        {
          test: /\.less$/,
          use: [
            'vue-style-loader', // Step 3
            'css-loader?sourceMap', // Step 2再執行這個
            //'postcss-loader?sourceMap',
            'less-loader?sourceMap' // Step 1 要先執行這個
          ]
        },
        {
          test: /\.vue$/,
          use: [
            'vue-loader'
          ],
        },
        { 
          test: /\.(eot|woff|woff2|svg|png|ttf)([\?]?.*)$/, 
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'asset',
                publicPath: 'dist/asset'
              }
            }
          ]
        },
                /*
                 {
                 test: /\.m?js$/,
                 exclude: /(node_modules|bower_components)/,
                 use: {
                 loader: 'babel-loader',
                 options: {
                 presets: ['@babel/preset-env'],
                 plugins: ['@babel/plugin-proposal-object-rest-spread']
                 }
                 }
                 }
                 */
      ]
    },
    /*
     optimization: {
     minimizer: [
     new UglifyJsPlugin({
     cache: true,
     parallel: true,
     sourceMap: true // set to true if you want JS source maps
     })
     ]
     },
     */
      plugins: [
        new VueLoaderPlugin(),
        {
          apply: (compiler) => {
            compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
              let paddingZero = (n) => {
                if (n < 10) {
                  n = '0' + n
                }
                return n
              }
              setTimeout(() => {
                compileCount++
                let date = new Date;
                let seconds = paddingZero(date.getSeconds())
                let minutes = paddingZero(date.getMinutes())
                let hour = paddingZero(date.getHours())
                console.warn(`[${compileCount}] Building completed at ${hour}:${minutes}:${seconds}`)
              }, 100)
            });
          } // apply: (compiler) => {
        }
      ]
  } // let webpackConfig = {

  //console.log(argv.mode)

  if (argv.mode === 'production') {
    webpackConfig.devtool = false
    
    webpackConfig.module.rules[0] = {
      test: /\.css$/, // 針對所有.css 的檔案作預處理，這邊是用 regular express 的格式
      use: [
        'style-loader', // 這個會後執行 (順序很重要)
        'css-loader', // 這個會先執行
        'postcss-loader',
      ]
    }
    webpackConfig.module.rules[1] = {
      test: /\.less$/,
      use: [
        'style-loader', // Step 3
        'css-loader', // Step 2再執行這個
        'postcss-loader',
        'less-loader' // Step 1 要先執行這個
      ]
    }
    webpackConfig.module.rules.push({
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-object-rest-spread']
        }
      }
    })
    webpackConfig.optimization = {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        })
      ]
    }
  }
  if (argv.mode === 'development') {

  }

  return webpackConfig
}
