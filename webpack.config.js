const path = require('path');
module.exports = {
    entry: "./src/main.ts",
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'build.js'
    },
    target: 'node',
    node: {
        console: true,
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
        setImmediate: true
    },    
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            "@/bing": path.resolve(__dirname, "./src/bing/"),
            "swarm-js": path.resolve(__dirname, './node_modules/swarm-js/lib/api-node.js')
        }
    },
    externals: [
        (function () {
          var IGNORES = [
            'electron'
          ];
          return function (context, request, callback) {
            if (IGNORES.indexOf(request) >= 0) {
              return callback(null, "require('" + request + "')");
            }
            return callback();
          };
        })()
    ],    
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                loader: 'native-ext-loader',
                options: {
                  rewritePath:  "./node_modules/scrypt/build/Release/"
                }
            },
            {
              test: /\.less$/,
              loader: "style-loader!css-loader!less-loader",
            }             
        ]
    }
}