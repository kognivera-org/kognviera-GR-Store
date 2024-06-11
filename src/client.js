// @flow
/* eslint no-console: "off" */

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { configureStore } from './redux/configureStore'
import AxiosClient from './helpers/AxiosClient'
import getRoutes from './routes'
import { connect as connectNes } from './redux/react-hapines'
// import appconfig from './config/appconfig'
import AuthenticatePage from './pages/AuthenticatePage'
const client = new AxiosClient()
const dest = document.getElementById('content')
const store = configureStore(browserHistory, client, window.processedStore)
const history = syncHistoryWithStore(browserHistory, store)

// stylesheets
// console.log('appconfig.bundleCSS', appconfig.bundleCSS)
// if (appconfig.bundleCSS) {
//   // const globalstylesheets = require('./config/stylesheets').globalstylesheets;
//   // globalstylesheets && globalstylesheets.map(sheet => {
//   //   console.log('./../static/assets' + sheet)
//   //   return require('./../static/assets' + sheet)
//   // });
//   import('./../static/assets/scss/generated.scss');
// }

// hapi-nes websocket
const wsUrl = `ws${window.location.protocol === 'https:' ? 's' : ''}://${window.location.host}`
global.socket = connectNes(store, wsUrl)
const RootComponent = () => (
  <Provider store={store} key="provider">
    <Router
      render={props =>
        <AuthenticatePage {...props} helpers={{ client }} filter={item => !item.deferred} />
      }
      history={history}
    >
      {getRoutes(store)}
    </Router>
  </Provider>
)

ReactDOM.render(
  <RootComponent />,
  dest,
)

if (DEVELOPMENT && module.hot) {
  module.hot.accept(() => {
    ReactDOM.render(
      <RootComponent />,
      dest,
    )
  })
}
