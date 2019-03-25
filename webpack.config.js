const path = require('path')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
//const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const ExtractTextPlugin = require("extract-text-webpack-plugin")
const WebpackShellPlugin = require('webpack-shell-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

let webpackConfig  = {
  cache: true,
  devtool: 'source-map',
  entry: {
    'test': './test.js'
    //'header': './header.js',
    //'footer': './footer.js',
  },
  output: {
    path: path.resolve('./bundle/'),
    filename: '[name].min.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 針對所有.css 的檔案作預處理，這邊是用 regular express 的格式
        use: [
          'style-loader', // 這個會後執行 (順序很重要)
          'css-loader', // 這個會先執行
          'postcss-loader',
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader', // Step 3
          'css-loader', // Step 2再執行這個
          'postcss-loader',
          'less-loader' // Step 1 要先執行這個
        ]
      },
      {
        test: /\.vue$/,
        use: [
          'vue-loader'
        ],
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
}

if (argv.mode === 'production') { 
  webpackConfig.moduel.rules.push({
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


//module.exports = [webpackConfig]