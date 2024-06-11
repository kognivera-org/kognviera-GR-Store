import cacheUtils from './cacheUtils'
import serverEndpoints from '../serverEndpoints'
import commonUtils from 'utils/commonUtil';
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import log from './logUtils'
import settingsFile from './../../../settings'
import { cacheable, brandNameServices } from '../config/endpoints/services';
import appconfig from '../../config/appconfig';

const settings = settingsFile[process.env.NODE_ENV];

const ServerUtils = {

    async triggerServerRequest(optionsArr) {

        // handle multiple requests
        const operations = _.isArray(optionsArr) ? optionsArr : [optionsArr];

        // for merging response in case of multiple requests
        let mergedData = {};

        // save original
        let originalRequestPayload = Object.assign({}, operations[0].request.payload);

        // iterate and run multiple requests (synchronously)
        for (var i = 0; i < operations.length; i++) {

            const options = operations[i];
            let request = options.request;
            let requestPayloadCopy = Object.assign({}, originalRequestPayload);
            const reply = options.reply;
            const transformRequest = options.transformRequest;
            const transformResponse = options.transformResponse;

            // custom timeout
            const timeout = options.timeout;

            // append node instance details to correaltion id header
            const nodeInstance = process.env.INSTANCE_NAME + '-pm' + (process.env.pm_id || 0);
            const correlationId = request.headers['x-correlation-id'] + '-' + nodeInstance;
            let path

            try {
                // transform request if asked for
                request = (transformRequest && request && transformRequest(request, requestPayloadCopy)) || request;

                path = request.path;

                // generate cache key
                const cacheKey = options.cacheKey ? path + '_' + options.cacheKey : path;

                if (Object.keys(requestPayloadCopy).length == 0) {
                    requestPayloadCopy = request.payload
                }

                // debug mode if asked for
                const debug = request.payload && request.payload.debug;
                debug && log.debug('running xx-debug-mode :: ', path, correlationId);

                // is request cacheable
                const iscachable = cacheable.indexOf(path) !== -1 && !debug;

                // determine brand parameter name
                const hasbrandname = brandNameServices.indexOf(path) !== -1;

                // get value from cache
                const cached = iscachable && await cacheUtils.get(cacheKey);

                if (cached) {
                    // reply cached value if found
                    log.debug('sending xx-cached-response :: ', path, correlationId);
                    reply(cached);
                    break;
                } else {
                    // transform brand property in request
                    if (hasbrandname) {
                        request.payload.brandName = request.payload.brand;
                        delete request.payload.brand;
                        log.debug('xx-removedbrand');
                    }

                    // deleting debug mode parameter
                    debug && delete request.payload.debug;

                    log.debug('sending xx-request :: ', path, correlationId, request.payload || request.query);

                    // cookie games
                    const cookie = this.transformCookies(request.headers.cookie);

                    const start = Date.now();
                    // trigger server request if not found in cache
                    const response = await axios({
                        method: request.method,
                        url: serverEndpoints[path],
                        data: request.payload,
                        params: request.query,
                        timeout: timeout || 50000,
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                            'x-correlation-id': correlationId,
                            'cookie': cookie || ''
                        }
                    })

                    const end = Date.now();
                    let data = response.data;

                    log.debug('received xx-service-response :: ', path, correlationId, `${end - start}ms`, data);

                    // for success response
                    if (data && data.status && data.status.status == 'success') {

                        // transform response
                        data = (transformResponse && transformResponse(data, requestPayloadCopy)) || data;

                        // push data to cache
                        iscachable && cacheUtils.push(cacheKey, data);
                    }

                    // revert brand name param for subsequent request
                    if (hasbrandname) {
                        request.payload.brand = request.payload.brandName;
                        delete request.payload.brandName;
                    }

                    // merge response
                    mergedData = { ...mergedData, ...data }

                    // send back response to browser
                    if (i == operations.length - 1) {
                        // log merged response
                        operations.length > 1 && log.debug('xx-merged-response :: ', path, correlationId, mergedData);

                        // pass atg instance header info back to the browser
                        const atgheader = 'atg:' + response.headers['gr-hostname'] + '----node:' + nodeInstance;

                        atgheader
                            ? reply(mergedData).header('gr-hostname', atgheader)
                            : reply(mergedData);
                    }
                }
            } catch (error) {
                // reply error if any
                log.error('received xx-error ' + correlationId + ' :: ', path, error)
                let err = appconfig && appconfig.defaultError;
                reply(err)
                break;
            }
        }
    },

    transformCookies(ckie) {
        log.debug('found xx-cookies :: ', ckie);
        let cookie = ckie && this.parseCookies(ckie);
        if (cookie) {
            cookie = {
                GR_SESSION_ID: cookie.GR_SESSION_ID,
                ORA_OTD_JROUTE_CC: cookie.ORA_OTD_JROUTE_CC,
                ORA_OTD_JROUTE_NJCC: cookie.ORA_OTD_JROUTE_NJCC,
            }
            cookie = this.stringifyCookies(cookie);
            log.debug('sending xx-cookies :: ', cookie);
        }
        return cookie;
    },

    ensureDirectoryExistence(filePath) {
        const dirname = path.dirname(filePath);
        if (fs.existsSync(dirname)) {
            return true;
        }
        this.ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
        fs.chmodSync(dirname, settings.directoryPermissions);
        return true;
    },

    parseCookies(cookie) {
        return cookie.split(';').reduce(
            function (prev, curr) {
                const m = / *([^=]+)=(.*)/.exec(curr);
                const key = m[1];
                const value = m[2];
                prev[key] = value;
                return prev;
            },
            {}
        );
    },

    stringifyCookies(cookies) {
        const list = [];
        for (const key in cookies) {
            list.push(key + '=' + cookies[key]);
        }
        return list.join('; ');
    }

}
export default ServerUtils;