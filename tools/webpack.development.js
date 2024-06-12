// @flow

const Path = require('path')
const webpack = require('webpack')
//const { server } = require('hails')
//const { logger } = server

const assetsPath = Path.resolve(__dirname, '../static/dist')
const host = 'localhost'
const port = process.env.PORT || 4001

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./isomorphic-tools'))

// bundle analyzer
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// babel
let babelrcObject = {}

try {
  babelrcObject = require('../package.json').babel
} catch (err) {
  console.log('==>     ERROR: Error parsing your babel.json.')
  console.log(err)
}

let babelConfig = {}
if (babelrcObject.env) {
  babelConfig = babelrcObject.env.development
}

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  context: Path.resolve(__dirname, '..'),
  entry: {
    main: [
      `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`,
      // 'bootstrap-sass!./src/theme/bootstrap.config.js',
      // 'font-awesome-webpack!./src/theme/font-awesome.config.js',
      './src/client.js',
    ],
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: `http://${host}:${port}/dist/`,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig,
          },
        ],
      },
      { test: /\.json$/, type: 'json' },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
            },
          },
        ],
      },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml' },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        use: 'url-loader?limit=10240',
      },
    ],
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.json', '.js', '.jsx'],
    fallback: {
      "domain": require.resolve("domain-browser"),
      "timers": require.resolve("timers-browserify"),
      "stream": require.resolve("stream-browserify"),
      "path": require.resolve("path-browserify")
    }
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin({resourceRegExp: /webpack-stats\.json$/}),
    new webpack.DefinePlugin({
      CLIENT: true,
      SERVER: false,
      DEVELOPMENT: true
    }),
    webpackIsomorphicToolsPlugin.development(),
    // new BundleAnalyzerPlugin({ analyzerPort: 5000, openAnalyzer: false })
  ],
}
