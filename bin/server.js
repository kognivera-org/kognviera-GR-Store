#!/usr/bin/env node
/* eslint import/no-extraneous-dependencies: "off" */

require('../tools/babel-require')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')

process.env.NODE_ENV = 'qa2'

global.CLIENT = false
global.SERVER = true
global.DISABLE_SSR = true
global.DEVELOPMENT = process.env.NODE_ENV !== 'production'

const settingsFile = require('../settings');
const settings = settingsFile[process.env.NODE_ENV];
global.clientSettings = settings.exportToClient;
global.version = settings.version;

process.env.APP_HOST="mrqa2.liverpool.com.mx";
process.env.TLS_KEY ='C:\\LP\\node_certs\\newatg.key';
process.env.TLS_CERT ='C:\\LP\\node_certs\\newatg.crt';
process.env.TLS_CA ='C:\\LP\\node_certs\\newatginter.crt';
//process.env.SECURE_PORT=8080;
process.env.TLS_ENABLE='true';
process.env.INSTANCE_NAME='local-ea';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; 
//process.env.Protocol='https';
process.env.HOST = 'mrqa2.liverpool.com.mx';


process.env.WS_TLS_KEY='C:\\LP\\multisite\\certificadosMS\\pwaws.key'
process.env.WS_TLS_CERT='C:\\LP\\multisite\\certificadosMS\\pwaws.crt'
process.env.WS_TLS_CA='C:\\LP\\multisite\\certificadosMS\\pwaws.crt'
		
		
process.env.PB_TLS_KEY='C:\\LP\\multisite\\certificadosMS\\pwapb.key'
process.env.PB_TLS_CERT='C:\\LP\\multisite\\certificadosMS\\pwapb.crt'
process.env.PB_TLS_CA='C:\\LP\\multisite\\certificadosMS\\pwapb.crt'
		
		
process.env.PBK_TLS_KEY='C:\\LP\\multisite\\certificadosMS\\pwapbk.key'
process.env.PBK_TLS_CERT='C:\\LP\\multisite\\certificadosMS\\pwapbk.crt'
process.env.PBK_TLS_CA='C:\\LP\\multisite\\certificadosMS\\pwapbk.crt'
		
process.env.GAP_TLS_KEY='C:\\LP\\multisite\\certificadosMS\\pwagap.key'
process.env.GAP_TLS_CERT='C:\\LP\\multisite\\certificadosMS\\pwagap.crt'
process.env.GAP_TLS_CA='C:\\LP\\multisite\\certificadosMS\\pwagap.crt'
		
		
process.env.WLM_TLS_KEY='C:\\LP\\multisite\\certificadosMS\\pwawe.key'
process.env.WLM_TLS_CERT='C:\\LP\\multisite\\certificadosMS\\pwawe.crt'
process.env.WLM_TLS_CA='C:\\LP\\multisite\\certificadosMS\\pwawe.crt'

process.env.SB_TLS_KEY='C:\\LP\\multisite\\certificadosMS\\pwawe.key'
process.env.SB_TLS_CERT='C:\\LP\\multisite\\certificadosMS\\pwawe.crt'
process.env.SB_TLS_CA='C:\\LP\\multisite\\certificadosMS\\pwawe.crt'

process.env.BR_TLS_KEY='C:\\LP\\multisite\\certificadosMS\\pwawe.key'
process.env.BR_TLS_CERT='C:\\LP\\multisite\\certificadosMS\\pwawe.crt'
process.env.BR_TLS_CA='C:\\LP\\multisite\\certificadosMS\\pwawe.crt'


process.env.TRU_TLS_KEY='C:\\LP\\multisite\\certificadosMS\\pwawe.key'
process.env.TRU_TLS_CERT='C:\\LP\\multisite\\certificadosMS\\pwawe.crt'
process.env.TRU_TLS_CA='C:\\LP\\multisite\\certificadosMS\\pwawe.crt'


// dynatrace
if (settings.dynatrace) {
  try {
    require('/home/node/dynatrace/dynatrace-oneagent-7.0/agent/bin/any/onenodeloader.js')(settings.dynatrace);
  } catch (err) {
    const log = require('../src/server/utils/logUtils');
    log.error(err.toString());
  }
}

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicTools = require('webpack-isomorphic-tools')
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../tools/isomorphic-tools'))
  .server(rootDir, () => {
    require('../src/server')
  })
