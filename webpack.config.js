const path = require('path');
const { WebPlugin } = require('web-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
        // 提取出css
        loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
        loader: 'base64-inline-loader',
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
    }),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash].css',
    }),
  ],
  devtool: 'source-map',
};
