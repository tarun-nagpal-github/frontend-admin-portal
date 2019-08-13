var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.config.js');
var path = require('path');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');


module.exports = webpackMerge(commonConfig, {

  mode: 'development',
  devtool: 'eval',


  output: {
    path: path.join(process.cwd(), '/dist'),
    publicPath: 'http://localhost:8080/',
    filename: 'index_bundle.js'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('[name].css'),
    new CaseSensitivePathsPlugin({ debug: false })
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
    inline: true,
    hot: true
  }
});