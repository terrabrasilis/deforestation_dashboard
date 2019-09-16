const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const helpers = require('./helpers');
const path = require('path');

module.exports = {
    //the entry-point files that define the bundles
    entry: { 
        polyfills: './src/polyfills.ts', //the polyfills needed to run Angular applications in most modern browsers
        vendor: './src/vendor.ts', //the third-party dependencies such as Angular, lodash, and bootstrap.css
        app: './src/main.ts', //the application code
        styles: ['./src/styles.css', './src/theme.scss'] // the style to the application
    },
    //how to resolve file names when they lack extensions
    resolve: {        
        extensions: ['.ts','.js','.jsx','.css','.scss'],
        symlinks: false,
        alias: {
            leafletcss: path.join(__dirname, '/../node_modules/leaflet/dist/leaflet.css'),
            timedimension: path.join(__dirname, '/../node_modules/terrabrasilis-timedimension/leaflet.timedimension.control.min.css'),
            leafletplugins: path.join(__dirname, '/../node_modules/terrabrasilis-map-plugins/dist/terrabrasilis-leaflet-plugins.min.css'),
            cssDc: path.join(__dirname, '/../src/assets/css/dc/dc.css'),
            cssGridstack: path.join(__dirname, '/../src/assets/css/gridstack/gridstack.css'),
            cssGridstackExtra: path.join(__dirname, '/../src/assets/css/gridstack/gridstack-extra.css'),
            cssAbout: path.join(__dirname, '/../src/assets/css/about/about.css'),
            cssBaselayer: path.join(__dirname, '/../src/assets/css/map/baselayer.css'),
            cssEstilo: path.join(__dirname, '/../src/assets/css/map/estilo.css'),
            cssMCustomScrollbar: path.join(__dirname, '/../src/assets/css/map/jquery.mCustomScrollbar.min.css'),
            cssRangeSlider: path.join(__dirname, '/../src/assets/css/map/rangeslider.css'),
            cssJqueryLoading: path.join(__dirname, '/../src/assets/css/jquery-ui/jquery.loading.css'),
            cssScrollingTabs: path.join(__dirname, '/../src/assets/css/jquery-scrolling/jquery.scrolling-tabs.min.css')
        }
    },        
    //module is an object with rules for deciding how files are loaded
    module: {
        rules: [ //Rules tell Webpack which loaders to use for each file, or module
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                include: __dirname
            },
            {
                test: /\.ts$/,
                use: [
                    'babel-loader?sourceMap', {
                        loader: 'awesome-typescript-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            configFileName: helpers.root('src', 'tsconfig.app.json')
                        }
                    },
                    'angular2-template-loader' //loads angular components' template and styles
                ],
                exclude: [/node_modules/]
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader?sourceMap',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }                    
                ], 
                exclude: [/node_modules/]
            },
            {
                test: /\.html$/,
                //use: 'html-loader?-minimize',                 
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: false,
                            removeComments: false,
                            collapseWhitespace: false,
                            removeAttributeQuotes: false,
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/, 
                loaders: 'file-loader?name=assets/img/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                loaders: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?sourceMap' 
                })
            },
            {
                test: /\.sass$/,
                include: helpers.root('src', 'app'),
                loaders: ['css-to-string-loader','css-loader','sass-loader'] 
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                loaders: ['css-to-string-loader','css-loader']
            },                       
            {
                test: /\.scss$/,
                include: helpers.root('src'),
                //loaders: 'raw-loader!sass-loader'
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ]
            }              
        ]
    },
    //creates instances of the plugins
    plugins: [

        new webpack.DefinePlugin({
            NGXSTORE_CONFIG: JSON.stringify({
              prefix: 'TB.V01_',
            })
        }),

        new webpack.ContextReplacementPlugin(
            /(.+)?angular(\\|\/)core(.+)?/,
            helpers.root('./src'),
            {}
        ),
        
        new webpack.optimize.SplitChunksPlugin({            
            filename: ['app','vendor','polyfills', 'styles'],            
            name: ['app','vendor','polyfills', 'styles'],
        }),

        new CopyWebpackPlugin([
            {
                from:'src/assets/js/jquery', 
                to:'assets/js/jquery'
            },
            {
                from:'src/assets/js/jquery-scrolling', 
                to:'assets/js/jquery-scrolling'
            },
            {
                from:'src/assets/js/jquery-ui', 
                to:'assets/js/jquery-ui'
            },
            {
                from:'src/assets/js/gridstack', 
                to:'assets/js/gridstack'
            },
            {
                from:'src/assets/js/lodash', 
                to:'assets/js/lodash'
            },
            {
                from:'src/assets/files', 
                to:'assets/files'
            },
            {
                from:'src/assets/js/map', 
                to:'assets/js/map'
            },
            {
                from:'src/assets/img', 
                to:'assets/img'
            },
            {
                from:'src/assets/css', 
                to:'assets/css'
            },
            {
                from:'src/favicon.ico', 
                to:'assets'
            },
            {
                from:'src/assets/i18n', 
                to:'assets/i18n'
            }
        ])
    ]
}