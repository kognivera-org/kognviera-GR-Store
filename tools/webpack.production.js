/* eslint import/no-extraneous-dependencies: "off" */
/* eslint global-require: "off" */

require('babel-polyfill')

// Webpack config for creating the production bundle.
const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const strip = require('strip-loader');


const logger = console;

const projectRootPath = path.resolve(__dirname, '../');
const assetsPath = path.resolve(projectRootPath, './static/dist');
const cssPath = path.resolve(projectRootPath, './static/assets/css');

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./isomorphic-tools'));

// const extractText = new ExtractTextPlugin({ filename: '[name]-[chunkhash].css', disable: false, allChunks: true });

// settings
getSettings = env => {
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

module.exports = {
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
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: [strip.loader('debug'), 'babel-loader'] },
      { test: /\.json$/, type: 'json' },
      {
        test: /Html.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader",'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml' },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), use: 'url-loader?limit=10240' },
    ],
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['*', '.json', '.js', '.jsx'],
    fallback: {
      "domain": require.resolve("domain-browser"),
      "timers": require.resolve("timers-browserify"),
      "stream": require.resolve("stream-browserify"),
      "path": require.resolve("path-browserify")
    }
  },
  plugins: [
    new CleanPlugin([assetsPath], { root: projectRootPath }),

    // css files from the extract-text-plugin loader
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
         NODE_ENV: JSON.stringify('production')
      },
      CLIENT: true,
      SERVER: false,
      DEVELOPMENT: false,
    }),

        // ignore dev config
        new webpack.IgnorePlugin({
            resourceRegExp: /\.\/dev/,
            contextRegExp: /\/config$/,
        }),

    // optimizations
    //new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //   },
    // }),
    webpackIsomorphicToolsPlugin,
  ],
}