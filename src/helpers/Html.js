/* eslint react/no-danger: "off" */
/* eslint global-require: "off" */
/* eslint import/no-dynamic-require: "off" */
/* eslint no-underscore-dangle: "off" */

import React, { Component } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';


/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object,
  }

  render() {
    const { assets, component, store, clientSettings, version, GTMAuth } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();

    return (
      <html lang="es">
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          <link
            rel="icon"
            href={clientSettings.ico}
            type="image/x-icon"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* Google Tag Manager */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer', '${GTMAuth}');`,
            }} async
          />
          {/* <link href="https://fonts.googleapis.com/css?family=Poppins|Source+Sans+Pro:300,300i,400,400i" rel="stylesheet" /> */}
          {/* <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" /> */}

          {/* --- production mode --- */}
          {/* styles (will be present only in production with webpack extract text plugin) */}
          {Object.keys(assets.styles).length !== 0 ?
            Object.keys(assets.styles).map(style => (
              <link
                href={assets.styles[style]} key={style} media="screen, projection"
                rel="stylesheet" type="text/css" charSet="UTF-8"
              />
            )) : null}

          {/* --- development mode --- */}
          {/* outputs a <style/> tag with all required css files. */}
          {Object.keys(assets.styles).length === 0 ?
            Object.keys(assets.assets).filter(it => (
              /* only css assets */
              it.slice(-5) === '.scss'
            )).map(it => (
              <style key={it} dangerouslySetInnerHTML={{ __html: require(`../../${it}`)._style }} />
            ))
            :
            null
          }
        </head>
        <body {...head.bodyAttributes.toComponent()}>
          <div
            id="content"
            style={{ width: '100% !important', height: '100%' }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.processedStore=${serialize(store.getState())};
                window.clientSettings=${serialize(clientSettings)};window.version='${version}';`,
            }}
            charSet="UTF-8"
          />
          <script src={`${clientSettings.assets}/javascript/config.js`} charSet="UTF-8" />
          <script src={assets.javascript.main} charSet="UTF-8" />
          <noscript
            dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTMAuth}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>` }}
          />
        </body>
      </html>
    );
  }
}
