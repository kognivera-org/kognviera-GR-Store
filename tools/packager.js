/* eslint import/no-extraneous-dependencies: "off" */
/* eslint-disable no-console */

const webpack = require('webpack');
const Hapi = require('@hapi/hapi');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.development');

const compiler = webpack(webpackConfig);
const host = 'localhost';
const port = 3001;
const serverOptions = {
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
};

const server = new Hapi.Server({host, port});
const devMiddleware = webpackDevMiddleware(compiler, serverOptions);
const hotMiddleware = webpackHotMiddleware(compiler);

server.app.webpackCompiler = compiler; // eslint-disable-line no-param-reassign

// server.connection({
//   host,
//   port,
// });

server.ext('onRequest', (request, h) => {
  const req = request.raw.req;
  const res = request.raw.res;

  return new Promise((resolve, reject) => {
    devMiddleware(req, res, (err) => {
      if (err) resolve(h.response(err));
      resolve(h.continue);
    });
  });
});

server.ext('onRequest', (request, h) => {
  const req = request.raw.req;
  const res = request.raw.res;
  return new Promise((resolve, reject) => {
    hotMiddleware(req, res, (err) => {
      if (err) resolve(h.response(err));
      resolve(h.continue);
    });
  });
});

server.start();

console.log(`� webpack packager has started at ${server.info.uri}`); // console required
