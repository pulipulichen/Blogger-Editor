'use strict';
const path = require('path')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
//const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const ExtractTextPlugin = require("extract-text-webpack-plugin")
const WebpackShellPlugin = require('webpack-shell-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin')

let compileCount = 0

module.exports = (env, argv) => {
  //console.log(argv.mode)

  let webpackConfig = {
    mode: argv.mode,
    cache: false,
    devtool: 'source-map',
    //devtool: false,
    entry: {
      //'test': './[tmp/test.js',
      'header': './src/header.js',
      'footer': './src/footer.js',
    },
    output: {
      path: path.resolve('./dist/'),
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
        {
          resourceQuery: /blockType=i18n/,
          type: 'javascript/auto',
          loader: '@kazupon/vue-i18n-loader',
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
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    plugins: [
      new VueLoaderPlugin(),
      new CleanTerminalPlugin(),
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
            console.clear();
            setTimeout(() => {
              compileCount++
              let date = new Date;
              let seconds = date.getSeconds();
              let minutes = date.getMinutes();
              let hour = date.getHours();
              //console.info('================================================')
              console.warn(`[${compileCount}] Building completed at ${hour}:${minutes}:${seconds}`)
              //console.info('================================================')
              //console.log('\033[2J');
              //process.stdout.write('\x1Bc'); 
              //console.clear();
              //process.stdout.write("\u001b[0J\u001b[1J\u001b[2J\u001b[0;0H\u001b[0;0W");
            }, 100)
          });
        }
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
    
    
    if (typeof(webpackConfig.optimization) !== 'object') {
      webpackConfig.optimization = {}
    }
    
    webpackConfig.optimization.minimizer = [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      })
    ]
  }
  if (argv.mode === 'development') {

  }

  return webpackConfig
}
