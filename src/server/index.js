/* eslint global-require: "off" */

import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import { match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import { Provider } from 'react-redux';
import fs from 'fs';
import path from 'path';
import { server } from '../hails';
import logger from '../server/utils/logUtils';
import { configureStore } from '../redux/configureStore';
import AxiosClient from '../helpers/AxiosClient';
import Html from '../helpers/Html';
import getRoutes from '../routes';
import settingsFile from '../../settings';

const cacheProvider = require('../utils/cache-provider');

const NODE_ENV = process.env.NODE_ENV;
const settings = settingsFile[NODE_ENV];
// settings.plugins = [
//   require('hapi-nested-route'),
// ];

const start = async () => {
  try {
   // const done = await server.init(settings);
    const pretty = new PrettyError();
  
    await server.register([
      require('@hapi/vision'),
      require('@hapi/inert'),
      //require('../hails/plugin-hapi-nested-route'),
    ]);

    server.route({
      method: '*',
      path: '/{p*}',
      handler: (request, h) => {
        if (request.path !== '/') {
          const fPath = path.resolve(`${__dirname}/../../static/${request.path}`);
          try {
            const stats = fs.statSync(fPath);
            if (stats) {
              return new Promise((resolve, reject) => {
                resolve(h.file(fPath, { confine: false }))
              });
              // return reply.file(fPath);
            }
          } catch (e) {
            /* empty */
          }
        }

        if (DEVELOPMENT) {
          // Do not cache webpack stats: the script file would change since
          // hot module replacement is enabled in the development env
          webpackIsomorphicTools.refresh();
        }
        const client = new AxiosClient(request);
        const memoryHistory = createHistory(request.path);
        const store = configureStore(memoryHistory, client);
        const history = syncHistoryWithStore(memoryHistory, store);

        function hydrateOnClient() {
          return new Promise((resolve, reject) => {
            resolve(h.response(`<!doctype html>${ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store} />)}`))
          })
        }

        if (DISABLE_SSR) {
          return hydrateOnClient();
        }

	return new Promise((resolve, reject) => {
         match({
          history,
          routes: getRoutes(store),
          location: request.path,
        }, (error, redirectLocation, renderProps) => {
          if (redirectLocation) {
            resolve(h.redirect(redirectLocation.pathname + redirectLocation.search));
          } else if (error) {
            logger.error('ROUTER ERROR:', pretty.render(error));
            return hydrateOnClient().code(500);
          } else if (renderProps) {
            loadOnServer({ ...renderProps, store, helpers: { client } }).then(() => {
              const component = (
                <Provider store={store} key="provider">
                  <ReduxAsyncConnect {...renderProps} />
                </Provider>
              );
              global.navigator = { userAgent: request.headers['user-agent'] };
              global.clientSettings = settings.exportToClient;
              const hidrateConfig = (<Html
                assets={webpackIsomorphicTools.assets()}
                component={component}
                store={store}
                clientSettings={global.clientSettings}
                version={global.version}
                GTMAuth={settings.taggingAuth}
              />);
              resolve(h.response(`<!doctype html>${ReactDOM.renderToString(hidrateConfig)}`));
            });
          } else {
            // TODO not found
            resolve(h.response('Not Found').code(404));
          }
        });
 	})
      },
    });

    await server.start()
    //done();

    logger.info('--------------------------------------------------------------------------');
    logger.info(`Running environment :: ${NODE_ENV}; on instance :: ${process.env.INSTANCE_NAME}`);
    logger.info(`Gift Registry Services connected to :: ${settings.endpoints.gr}`);
    logger.info(`eCommerce Services connected to :: ${settings.endpoints.commerce}`);
    logger.info(`✅ SERVER HAS STARTED at ${server.info.uri}`);
    logger.info('--------------------------------------------------------------------------');

    cacheProvider.start((err) => {
      if (err) logger.error(err);
    });
  } catch (e) {
    logger.error(e);
  }
};

start().catch((e) => {
  logger.error(e, e.stack);
});
