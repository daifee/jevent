
var webpack = require('webpack');
var config = require('./webpack.config.js');

var uglify = new webpack.optimize.UglifyJsPlugin({
  compress: true
});


config.plugins = [uglify];
config.output.filename = config.output.filename.replace('.js', '.min.js');

module.exports = config;
