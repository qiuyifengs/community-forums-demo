const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * 根目录
 * @param {*} subdir 子目录
 */
function srcPath(subdir) {
    return path.join(__dirname, '..', subdir);
}

module.exports = {
    entry: {poll:'webpack/hot/poll?1000', main:'./src/main.ts'},
    // watch: true,
    // target: 'node',
    // externals: [
    //     nodeExternals({
    //         whitelist: ['webpack/hot/poll?1000'],
    //     }),
    // ],
    module: {
        rules: [
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                },{
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
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
            // {
            // 	//文件加载器，处理文件静态资源
            // 	test: /\.(png|jpg|gif|svg)$/,
            //   loader: 'file-loader',
            //   options: {
            //     name: 'images/[name].[ext]'
            //   }
            // },
            {
              //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
              //如下配置，将小于8192byte的图片转成base64码
              test: /\.(png|jpg|gif|svg)$/,
              loader: 'url-loader?limit=8192&name=./dist/libs/images/[name].[ext]'
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.ejs'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'build.js',
    },
};
