
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * ejs 模块打包
 * @param {*} globPath 
 */

function getEntry(globPath) {
    var entries = {},
        basename, tmp;

    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        // 过滤掉本模块的 ejs 的入口文件
        if (path.extname(entry).indexOf('.ejs') > -1 || path.extname(entry).indexOf('.js') > -1) {
            // if (globPath.indexOf('libs') > -1) {
            //     entries[entry.replace('./src/libs/js', 'common')] = entry
            // } else {
                entries[basename] = entry;
            // }
        }
    });
    return entries;
}
const HtmlTpl = getEntry('./src/**/*.ejs')
const appPath = {app: ['webpack/hot/poll?1000', './src/main.ts']}
// const jQuery = {jQuery: ['./src/libs/js/jquery.js',]}
const common = { common: [
    // './src/libs/js/jquery-3.3.1.js', 
    './src/libs/js/common.js',
    './src/libs/js/pageTurning.js',
    './src/libs/js/ghost-ui.js',
    './src/libs/js/jquery.cookie.js',
    './src/libs/js/httphijack1.0.0.js',
    './src/libs/js/waves.min.js',
    './src/libs/js/layer.js',
    './src/libs/js/tagsinput.js',
    './src/libs/js/autosize.js',
    './src/libs/js/dropload/dropload.min.js',
    './src/libs/js/dropload/zepto.min.js',
    './src/libs/js/lang/en.js',
    './src/libs/js/lang/zh.js',
    './src/libs/js/sensitiveWords.js'
]}
const Entry = Object.assign(common, appPath, getEntry('./src/views/**/*.js'))
const htmlConfig = () => {
    let config = []
    for (let attr in HtmlTpl) {
        const attrPath = HtmlTpl[attr].replace('./src/', '')
        config.push(
            new HtmlWebpackPlugin({
                filename: `./dist/${attrPath}`,
                template: HtmlTpl[attr],
                inject: "head",
                chunks: ['commonCss', 'common', HtmlTpl[attr].split('/')[HtmlTpl[attr].split('/').length-1].replace('.ejs', '')], // 预览模块js独立打包
                chunksSortMode: 'manual',
                minify: true
            })
        )
        
    }
    return config;
}
/**
 * 根目录
 * @param {*} subdir 子目录
 */
function resolve(subdir) {
    return path.join(__dirname, '..', subdir);
}
module.exports = {
    // entry: ['webpack/hot/poll?1000', './src/main.ts'],
    entry: Entry,
    watch: true,
    target: 'node',
    node: { fs: 'empty'},
    externals: [
        nodeExternals({
            whitelist: ['webpack/hot/poll?1000'],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }, 
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(tpl|ejs)$/,
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
                loader: 'file-loader?name=./dist/libs/images/[name].[ext]',
                
            },
            {
              //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
              //如下配置，将小于8192byte的图片转成base64码
              test: /\.(png|jpg|gif|svg)$/,
              loader: 'url-loader?limit=8192&name=./dist/libs/images/[name].[ext]'
            },
            {
                loader: 'image-webpack-loader',// 压缩图片
                options: {
                  bypassOnDebug: true,
                }
            }
        ],
    },
    mode: "development",
    // mode: "production",
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.ejs'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('dist/libs/style/[name].[hash].css'),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": "jquery",
            "window.jquery": "jquery"
          }),
        new CopyWebpackPlugin([{
            from: __dirname + '/src/libs/images/',
            to: './dist/libs/images/'
        }]),
    ].concat(htmlConfig()),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'dist/js/[name].[hash].js',
        publicPath: path.join(__dirname, 'dist'),
    },
};
