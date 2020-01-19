const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('./webpack.config.base');
const path = require('path');


const GLOBALS = {
  'process.env': {
    'NODE_ENV': JSON.stringify('development')
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'true'))
};

module.exports = merge(config, {
  debug: true,
  cache: true,
  devtool: 'cheap-module-eval-source-map',
  entry: {
    calendar: [
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      './apps/calendar'
    ],
    admin: [
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      './apps/admin'
    ],
    collection: [
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      './apps/collection'
    ],
    cart: [
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      './apps/cart'
    ],
    vendor: ['react', 'react-dom']
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS)
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader"
      },
    ]
  }
});
