const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const merger = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config.js')
const nodeExternals = require('webpack-node-externals');

const glob = require('glob')
function getEntry(globPath) {
    var entries = {},
        basename, tmp;
    
    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        if (path.extname(entry).indexOf('.ejs') > -1 && tmp[2].indexOf(tmp[1]) === -1 || path.extname(entry).indexOf('.js') > -1) {
            entries[basename] = entry
        }
    });
    return entries;
}
// const entryObj = {poll:'webpack/hot/poll?1000', main:'./src/main.ts'}
const Entry = getEntry('./src/libs/**/*.js')
const HtmlTpl = getEntry('./src/views/**/*.ejs')
const htmlConfig = () => {
    let config = []
    for (let attr in HtmlTpl) {
        const attrPath = HtmlTpl[attr].replace('./src/', '');
        config.push(
            new HtmlWebpackPlugin({
                filename: `./dist/${attrPath}`,
                template: HtmlTpl[attr],
                inject: true,
                // minify: true
            })
        )
        
    }
    return config;
}
module.exports = merger(baseWebpackConfig, {
    entry: Entry,
    watch: true,
    target: 'node',
    externals: [
        nodeExternals({
            whitelist: ['webpack/hot/poll?1000'],
        }),
    ],
    output: {
        filename: 'dist/js/[name].js',
        // path: path.join(__dirname, 'dist'),
        // filename: 'build.js',
    },
    plugins: [
        // new CleanWebpackPlugin(['dist']),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin('css/[name].css'),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new UglifyJSPlugin({
            uglifyOptions: {
                ie8: false,
                output: {
                    comments: false,
                    beautify: false,
                },
                mangle: {
                    keep_fnames: true
                },
                compress: {
                    warnings: false,
                    drop_console: true
                },
            }
        }),
    ].concat(htmlConfig()),
    mode: 'production'
})