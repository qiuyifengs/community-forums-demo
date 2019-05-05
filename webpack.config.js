const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
function getEntry(globPath) {
  var entries = {},
      basename, tmp;

  glob.sync(globPath).forEach(function (entry) {
      basename = path.basename(entry, path.extname(entry));
      tmp = entry.split('/').splice(-3);
      // 过滤掉本模块的 ejs 的入口文件
      if (path.extname(entry).indexOf('.ejs') > -1 || path.extname(entry).indexOf('.js') > -1) {
          entries[basename] = entry
      }
  });
  return entries;
}
const HtmlTpl = getEntry('./src/**/*.ejs')
const htmlConfig = () => {
  let config = []
  for (let attr in HtmlTpl) {
    const attrPath = HtmlTpl[attr].replace('./src/', '')
        config.push(
            new HtmlWebpackPlugin({
                filename: `./dist/${attrPath}`,
                template: HtmlTpl[attr],
                inject: true
            })
        )
      
  }
  return config;
}
/**
 * 根目录
 * @param {*} subdir 子目录
 */
function srcPath(subdir) {
  return path.join(__dirname, 'src', subdir);
}

module.exports = {
  entry: ['webpack/hot/poll?1000', './src/main.ts'],
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
				test: /\.ejs$/,
        loader: 'ejs-loader',
        query: {
          variable: 'data',
          interpolate : '\\{\\{(.+?)\\}\\}',
          evaluate : '\\[\\[(.+?)\\]\\]'
        }
      },
      {
        test: /\.css$/,
				//配置css的抽取器、加载器。'-loader'可以省去
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
    ],
  },
  mode: "development",
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.ejs', 'css'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('libs/style/[name]/[name].css'),

  ].concat(htmlConfig()),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'build.js',
  },
};
