const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const findChrome = require('chrome-finder');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EndWebpackPlugin = require('end-webpack-plugin');
const { WebPlugin } = require('web-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const outputPath = path.resolve(__dirname, 'docs');
module.exports = {
  output: {
    path: outputPath,
    publicPath: '',
    filename: '[name]_[chunkhash:8].js',
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
    new DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new WebPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash].css',
    }),
    new OptimizeCSSAssetsPlugin(),
    new EndWebpackPlugin(async () => {
      // 自定义域名
      fs.writeFileSync(path.resolve(outputPath, 'CNAME'), 'resume.wuhaolin.cn');

      // 调用 Chrome 渲染出 PDF 文件
      const chromePath = findChrome();
      spawnSync(chromePath, ['--headless', '--disable-gpu', `--print-to-pdf=${path.resolve(outputPath, 'resume.pdf')}`,
        'http://resume.wuhaolin.cn' // 这里注意改成你的在线简历的网站
      ]);
    }),
  ]
};
