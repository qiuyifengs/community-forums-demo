const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
/**
 * ejs 模块打包
 * @param {*} globPath 
 */
function getEntry(globPath) {
  var entries = {},
      basename, tmp;

  glob.sync(globPath).forEach(function (entry) {
      // basename = path.basename(entry, path.extname(entry));
      tmp = entry.split('/').splice(-3);
      
      // 过滤掉本模块的 ejs 的入口文件
      if (path.extname(entry).indexOf('.ejs') > -1 || path.extname(entry).indexOf('.js') > -1) {
          entries[entry] = entry;
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
// const CssTpl = getCssEntry('./src/libs/verdors.js')
// function getCssEntry(globPath) {
//   var entries = {};
//   console.log(globPath)
//   glob.sync(globPath).forEach(function (entry) {
//       // 过滤掉本模块的 ejs 的入口文件
//       if (path.extname(entry).indexOf('.css') > -1) {
//           entries[entry] = entry;
//       }
//   });
//   return entries;
// }
// const cssConfig = () => {
//   let config = []
//   for (let attr in CssTpl) {
//     const attrPath = CssTpl[attr].replace('./src/', '')
//     console.log(2, attrPath)
//         config.push(new ExtractTextPlugin(`./dist/${attrPath}`))
//   }
//   return config;
// }
/**
 * 根目录
 * @param {*} subdir 子目录
 */
function srcPath(subdir) {
  return path.join(__dirname, 'src', subdir);
}

module.exports = {
  entry: ['webpack/hot/poll?1000', './src/main.ts', './src/libs/verdors.js'],
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
        loader: 'underscore-template-loader',
        query: {
          variable: 'data',
          interpolate : '\\{\\{(.+?)\\}\\}',
          evaluate : '\\[\\[(.+?)\\]\\]'
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader'
                }
            ]
        })
    },
      {
				//文件加载器，处理文件静态资源
				test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]'
        }
			},
      {
				//图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
				//如下配置，将小于8192byte的图片转成base64码
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'url-loader?limit=8192&name=./img/[name][hash].[ext]'
			}
    ],
  },
  mode: "development",
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.ejs'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('/libs/style/[name].css'),
  ].concat(htmlConfig()),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'build.js',
  },
};
