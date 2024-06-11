/* eslint import/no-extraneous-dependencies: "off" */
/* eslint global-require: "off" */

require('babel-polyfill')

// Webpack config for creating the production bundle.
const path = require('path')
const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const strip = require('strip-loader')

const logger = console

const projectRootPath = path.resolve(__dirname, '../')
const assetsPath = path.resolve(projectRootPath, './static/dist')
const cssPath = path.resolve(projectRootPath, './static/assets/css');
const scssPath = path.resolve(projectRootPath, './static/assets/scss');
const resolve1 = path.resolve(projectRootPath, './static/assets/css/eventGiftList/adminRegisteredGifts');

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./isomorphic-tools'))

const extractText = new ExtractTextPlugin({ filename: '/css/[name]-[chunkhash].css', disable: false, allChunks: true })

// settings
const getSettings = env => {
    const environment = env || 'production';
    let settingsObject = {}
    let exportToClient = {}
    try {
        settingsObject = require('../settings.js')[environment]
        return settingsObject;
    } catch (err) {
        logger.error('==>     ERROR: Error parsing your settings.js.')
        logger.error(err)
    }
}

// scss file operations
import fo from './webpack.fileops'
import { stylesheets } from './../src/config/stylesheets';
import fs from 'fs';

const init = () => {
    fo.cpdirSync(cssPath, scssPath, () => {
        let x = '';
        for (let [k, v] of Object.entries(stylesheets)) {
            if (k) {
                v.map(d => {
                    let bemclass = '.' + k.split('/:')[0].replace(new RegExp('/', 'g'), '-');
                    bemclass = bemclass === '.-' ? '.root' : bemclass;
                    x += bemclass.toLowerCase() + ' {\n' +
                        '\t@import \'./' + d.replace('/css/', '').replace('.css', '') + '\';\n'
                        + '}\n';
                })
            }
        }
        x !== '' && fs.writeFileSync(scssPath + '/generated.scss', x);
        fs.chmodSync(scssPath + '/generated.scss', getSettings().filePermissions);
        console.log('🚀  fo-webpack: generated.scss file created.');
    })
}

module.exports = env => {
    init();
    const settingsObject = getSettings(env)
    return {
        devtool: 'source-map',
        context: path.resolve(__dirname, '..'),
        entry: {
            main: [
                // 'bootstrap-sass!./src/theme/bootstrap.config.prod.js',
                // 'font-awesome-webpack!./src/theme/font-awesome.config.prod.js',
                './src/client.js',
            ],
        },
        output: {
            path: assetsPath,
            filename: '[name]-[chunkhash].js',
            chunkFilename: '[name]-[chunkhash].js',
            publicPath: '/dist/',
        },
        module: {
            loaders: [
                { test: /\.jsx?$/, exclude: /node_modules/, loaders: [strip.loader('debug'), 'babel-loader'] },
                { test: /\.json$/, loader: 'json-loader' },
                {
                    test: /\.(css|sass|scss)$/,
                    use: extractText.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    // If you are having trouble with urls not resolving add this setting.
                                    // See https://github.com/webpack-contrib/css-loader#url
                                    url: false,
                                    minimize: true,
                                    sourceMap: false,
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: false,
                                }
                            },
                        ]
                    })
                },
                { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
                { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
                { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream' },
                { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
                { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml' },
                { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' },
            ],
        },
        resolve: {
            modules: [
                'src',
                'node_modules',
            ],
            extensions: ['*', '.json', '.js', '.jsx'],
        },
        plugins: [
            new CleanPlugin([assetsPath], { root: projectRootPath }),

            // css files from the extract-text-plugin loader
            extractText,
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"' + env + '"',
                    HOST: settingsObject.connection.host,
                    PORT: settingsObject.connection.port
                },
                CLIENT: true,
                SERVER: false,
                DEVELOPMENT: false,
            }),

            // ignore dev config
            new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

            // optimizations
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                },
            }),
            webpackIsomorphicToolsPlugin,
        ],
    }
}
