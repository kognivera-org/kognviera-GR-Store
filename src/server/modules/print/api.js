import axios from 'axios'
import React from 'react'
import { server } from 'hails'
import serverEndpoints from '../../../server/serverEndpoints'
import serverUtils from '../../utils/serverUtils'
import log from '../../utils/logUtils'
import _ from 'lodash'
import commonUtil from '../../../utils/commonUtil'
// import printconfig from './config'
//const htmlPdf = require('html-pdf-chrome');
const pdf = require('html-pdf');
import RecibidosDownloadGuestMessages from './templates/RecibidosDownloadGuestMessages'

server.route.post('/api/print', {
    tags: ['api'],
    payload: {
        maxBytes: 10485760
    },
}, async (request, reply) => {
    let markup = request.payload.markup;
    log.debug('requesting xx-print-pdf :: ', markup);
    const footer = request.payload.footer || '';
    const brand = request.payload.brand || 'LP';
    markup = '<style>html {zoom: 0.60}</style>' + markup
    const date = commonUtil.formatDate(Date.now(), 'monthName');
    const printconfig = {};
    const config = {
        // Papersize Options: http://phantomjs.org/api/webpage/property/paper-size.html
        //"height": "10.5in",        // allowed units: mm, cm, in, px
        //"width": "8in",            // allowed units: mm, cm, in, px
        //- or -
        "format": "A4",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
        "orientation": "portrait", // portrait or landscape

        // Page options
        //"border": "1px",             // default is 0, units: mm, cm, in, px
        //- or -
        //"border": {
        //  "top": "2in",            // default is 0, units: mm, cm, in, px
        //  "right": "1in",
        //  "bottom": "2in",
        //  "left": "1.5in"
        //},
        margin: {
            bottom: '2in'
        },
        paginationOffset: 1,       // Override the initial pagination number
        "header": {
            "height": "65px",
            "contents": `
                  <div style="display:block; width: 90%;">
                       <div style="display:block; float: left; text-align:left; width: 400px; height: 80px;">
                            ${printconfig['logo' + brand]}
                       </div>
                       <div style="font-size: 16px; color: #545d5e; display:block; float: right; text-align: right; width: 300px; height: 40px;">
                            ${date}<br/>
                            ${printconfig['logoMesa']}
                       </div>
                   </div>`
        },
        "footer": {
            "height": "30px",
            "contents": {
                default: `
                   <div style="display:block; margin: 0 35px 15px; width: 95%;">
                       <div style="font-size: 20px; float: left; text-align:left;">
                           ${footer}
                       </div>
                       <div style="font-size: 20px; float: right; text-align:right;">
                           Página <span class="pageNumber">{{page}}</span> de <span class="totalPages">{{pages}}</span>
                       </div>
                   </div>
                   ` // fallback value
            }
        },


        // Rendering options
        //"base": "file:///home/www/your-asset-path", // Base path that's used to load files (images, css, js) when they aren't referenced using a host

        // Zooming option, can be used to scale images if `options.type` is not pdf
        //"zoomFactor": "1", // default is 1

        // File options
        "type": "pdf",             // allowed file types: png, jpeg, pdf
        //"quality": "75",           // only used for types png & jpeg

        // Script options
        //"phantomPath": "./node_modules/phantomjs/bin/phantomjs", // PhantomJS binary which should get downloaded automatically
        //"phantomPath": "/u01/oracle/nodejs/apps/lpgr_frontend_store_src/node_modules/phantomjs-prebuilt/bin/phantomjs",
        //"phantomArgs": [], // array of strings used as phantomjs args e.g. ["--ignore-ssl-errors=yes"]
        //"script": '/url',           // Absolute path to a custom phantomjs script, use the file in lib/scripts as example
        "timeout": 60000,           // Timeout that will cancel phantomjs, in milliseconds

        // Time we should wait after window load
        // accepted values are 'manual', some delay in milliseconds or undefined to wait for a render event
        //"renderDelay": 1000,

        // HTTP Headers that are used for requests
        //"httpHeaders": {
        // e.g.
        //  "Authorization": "Bearer ACEFAD8C-4B4D-4042-AB30-6C735F5BAC8B"
        //},

        // To run Node application as Windows service
        "childProcessOptions": {
            "detached": true
        }

        // HTTP Cookies that are used for requests
        //"httpCookies": [
        // e.g.
        //{
        //  "name": "Valid-Cookie-Name", // required
        //  "value": "Valid-Cookie-Value", // required
        //  "domain": "localhost",
        //  "path": "/foo", // required
        //  "httponly": true,
        //  "secure": false,
        //  "expires": (new Date()).getTime() + (1000 * 60 * 60) // e.g. expires in 1 hour
        //}
        //]

    }

    pdf.create(markup, config).toBuffer(function (err, buffer) {
        log.debug('requested xx-print-pdf printed :: ', err);
        reply(buffer);
    });
});