const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const webpack = require('webpack');
const helpers = require('./helpers');
const path = require('path');

console.log("@@@@@@@@ DEVELOPMENT ENVIRONMENT STARTED @@@@@@@@");

//https://github.com/webpack/docs/wiki/webpack-dev-server
module.exports = webpackMerge(commonConfig, {
    devtool: 'inline-source-map',
    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].bundle.js',
    },
    devServer: {
        historyApiFallback: true,
        stats: 'minimal',
        inline: true,
        hot: true,
        contentBase: [
            path.join(__dirname, '../src/app/dashboard/deforestation'),
            path.join(__dirname, '../src/app/dashboard/deforestation/deforestation-options'),
            path.join(__dirname, '../src/app/services'),
        ]
    },
    optimization: {
        minimizer: [
          new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                collapse_vars: false,                
              },
              ecma: 6,
              mangle: {
                keep_fnames: true,
                reserved: ['leaflet', 'terraformer', 'esri-leaflet', 'Terrabrasilis']
              },
            },
            sourceMap: true            
          })
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),

        new webpack.DefinePlugin({
            'process.env': {
                API_URL: JSON.stringify('http://localhost:4200/api/')
            }
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index-dev.html'
        }),

        new webpack.NamedModulesPlugin(),

        new webpack.HotModuleReplacementPlugin({
            multiStep:false
        }),
    ]
})