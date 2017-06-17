const fs = require('fs');
const path = require('path');
const { WebPlugin } = require('web-webpack-plugin');

module.exports = {
  output: {
    publicPath: '',
    filename: '[name].js',
  },
  resolve: {
    // 加快搜索速度
    modules: [path.resolve(__dirname, 'node_modules')],
    // es tree-shaking
    mainFields: ['jsnext:main', 'browser', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
        loader: 'file-loader',
      },
    ]
  },
  entry: {
    main: './src/main.js',
  },
  plugins: [
    new WebPlugin({
      template: './src/index.html',
      filename: 'index.html',
      requires: ['main'],
    }),
  ],
  devtool: 'source-map',
};
