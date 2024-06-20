import * as Hapi from '@hapi/hapi'
import * as Hoek from '@hapi/hoek'
//import { getSettings } from './settings'
import settingsFile from '../../settings';
import * as defaultConst from '../utils/clientConstant';
const settings = settingsFile[process.env.NODE_ENV];
const logger = console;
//const settings = getSettings();

import fs from 'fs';
if(process.env.TLS_ENABLE === 'true')
{
  const tls = require('tls');
let sites = defaultConst.activeSites;
let constBrand = defaultConst.UIBrands;
let ssl = {};
 let secureContextObject = {};
 for(var i in sites ){
  ssl = defaultConst.retreiveSiteSpecificSSLCert(sites[i],constBrand[i]['id']);
  if(ssl && ssl['key'] && ssl['cert'] && ssl['ca']){
    console.log("sl=====",ssl['key']);
    secureContextObject[sites[i]] = tls.createSecureContext({
     key: fs.readFileSync(process.env[ssl['key']], 'utf8'),
     cert: fs.readFileSync(process.env[ssl['cert']], 'utf8'),
     ca: fs.readFileSync(process.env[ssl['ca']], 'utf8'),
 })
  } 
}
var secureContext = secureContextObject;
  let  options = {
    tls: {
       SNICallback: function (domain, cb) {
        let subDomainName = 'liverpool.com.mx'
        logger.info("server requested domain is " + domain + " &  sub domain logic value is " + subDomainName);
  
        if (secureContext[subDomainName]) {
          logger.info('  --TLS_KEY = ' + process.env.TLS_KEY + ' -- TLS_CERT = ' + process.env.TLS_CERT + '   TLS_CA = ' + process.env.TLS_CA);
          if (cb) {
            logger.info("cb is true and sub-domain is " + subDomainName);
            cb(null, secureContext[subDomainName]);
          } else {
            // compatibility for older versions of node
            logger.info("cb is false and sub-domain is " + subDomainName);
            return secureContext[subDomainName];
          }
        } else {
          console.error("No keys/certificates for domain requested, domain = " + domain);
          // Never add throw new error here 
        }
      }, 
      key: fs.readFileSync(process.env.TLS_KEY, 'utf8'),//default
      cert: fs.readFileSync(process.env.TLS_CERT, 'utf8'), //default
      ca: fs.readFileSync(process.env.TLS_CA, 'utf8'), //default
  
    }
  }
  settings.connection.tls = options.tls;
}

///console.log("=======",settingsdd.connection)

function makeDefaultOptions() {
    return Hoek.applyToDefaults(settings.connection, {
      routes: {
        json: {
          space: 2,
        },
      }
    })
}

export const server = Hapi.server(makeDefaultOptions());
