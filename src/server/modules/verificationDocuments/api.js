import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
// import { server } from 'hails'
import fs from 'fs'
import serverEndpoints from 'server/serverEndpoints'
import serverUtils from '../../utils/serverUtils'
import settingsFile from '../../../../settings'
import log from '../../utils/logUtils'
import appconfig from '../../../config/appconfig';
module.exports = function () {
    return [
        {
            method: 'POST',
            path: '/api/uploadEventDocument',
            handler: async (request, reply) => {
                const correlationId = request.headers['x-correlation-id'] + '-' + process.env.INSTANCE_NAME + '-pm' + (process.env.pm_id || 0);
                const settings = settingsFile[process.env.NODE_ENV];

                log.debug('saving xx-file :: ', request.path, correlationId);

                const buffer = request.payload.file;
                if (buffer) {
                    const eventId = request.payload.eventId;
                    const filename = request.payload.documentName;
                    const filePath = `${settings.mount}${settings.verificationDocsDir}${eventId}`;
                    const payl = {
                        buffer: buffer,
                        channel: request.payload.channel,
                        brand: request.payload.brand,
                        eventId: eventId,
                        documentName: filename,
                        locationPath: filePath,
                    }

                    request.payload = payl;

                    var promise = function (request) {
                        let payload = request.payload;
                        return new Promise(function (resolve, reject) {
                            const buffer = payload.buffer;
                            const eventId = payload.eventId;
                            const locationPath = payload.locationPath + "/" + filename;
                            const exists = serverUtils.ensureDirectoryExistence(locationPath);
                            if (exists) {
                                fs.writeFile(locationPath, buffer, (error) => {
                                    if (error) throw error;
                                    log.debug('saved xx-file to :: ' + locationPath);
                                    fs.chmodSync(locationPath, settings.filePermissions);
                                    log.debug('permissions given to xx-file :: ' + locationPath);
                                    delete payload.buffer;
                                    resolve(request)
                                });
                            }
                        })
                    }
                    promise(request).then(async function (results) {
                        results.headers = {
                            ...results.headers,
                            'content-type': 'application/json'
                        }
                        let res =  await serverUtils.triggerServerRequest({
                            request,
                            reply                             
                        });
                        if(res.header)
                            {
                                return reply.response(res).header('gr-hostname', res.header)
                                 
                            }
                            else 
                            {
                                return reply.response(res)
                            }
                    }).catch(e => {
                        log.error(e);
                        return reply.response(appconfig.defaultError);
                    });
                } else {
                    return reply.response(appconfig.defaultError);
                }
            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        maxBytes: 10485760
                    }),
                }
            }

        },
        {
            method: 'POST',
            path: '/api/getEventDocuments',
            handler: async (request, reply) => {
                let res =  await serverUtils.triggerServerRequest({
                    request,
                    reply,
                    transformResponse: (response) => {
                        return response && {
                            documentId: request.payload.documentId,
                            ...response.data
                        }
                    }                   
                });
                if(res.header)
                    {
                        return reply.response(res).header('gr-hostname', res.header)
                         
                    }
                    else 
                    {
                        return reply.response(res)
                    }

            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().required(),
                        brand: Joi.string().required(),
                        eventId: Joi.string().required()
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/removeEventDocument',
            handler: async (request, reply) => {
                
                let res =  await serverUtils.triggerServerRequest({
                    request,
                    reply,
                    cacheKey: request.payload.searchType
                });
                if(res.header)
                    {
                        return reply.response(res).header('gr-hostname', res.header)
                         
                    }
                    else 
                    {
                        return reply.response(res)
                    }
            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().required(),
                        brand: Joi.string().required(),
                        eventId: Joi.string().required(),
                        documentName: Joi.string().required(),
                        documentId: Joi.string().required(),
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/downloadEventDocument',
            handler: async (request, reply) => {
                try {
                    const correlationId = request.headers['x-correlation-id'] + '-' + process.env.INSTANCE_NAME + '-pm' + (process.env.pm_id || 0);
                    const settings = settingsFile[process.env.NODE_ENV];
            
                    log.debug('download xx-file :: ', request.path, correlationId, request.payload || request.query);
                    const documentName = request.payload.documentName;
                    const eventId = request.payload.eventId;
                    const filePath = `${settings.mount}${settings.verificationDocsDir}${eventId}/`;
                    let filename = filePath + documentName;
                    fs.readFile(filename, (err, bitmap) => {
                        if (err) throw err;
                        log.debug('read xx-file completed.');
                        // log.debug('xx Delete file after response is sent');
                        // fs.unlink(filename, (err) => {
                        //     if (err) throw err;
                        //      log.debug(filename + ' was deleted');
                        // });
                        return reply.response(bitmap)
                    });
                } catch (error) {
                    log.error(error);
                    return reply.response(error);
                }
            },
            options: {
                tags: ['api'],
                
            }
        }

         
    ]
}
// server.route.post('/api/uploadEventDocument', {
//     tags: ['api'],
//     payload: {
//         maxBytes: 10485760
//     },
// }, async (request, reply) => {

//     const correlationId = request.headers['x-correlation-id'] + '-' + process.env.INSTANCE_NAME + '-pm' + (process.env.pm_id || 0);
//     const settings = settingsFile[process.env.NODE_ENV];

//     log.debug('saving xx-file :: ', request.path, correlationId);

//     const buffer = request.payload.file;
//     if (buffer) {
//         const eventId = request.payload.eventId;
//         const filename = request.payload.documentName;
//         const filePath = `${settings.mount}${settings.verificationDocsDir}${eventId}`;
//         const payl = {
//             buffer: buffer,
//             channel: request.payload.channel,
//             brand: request.payload.brand,
//             eventId: eventId,
//             documentName: filename,
//             locationPath: filePath,
//         }

//         request.payload = payl;

//         var promise = function (request) {
//             let payload = request.payload;
//             return new Promise(function (resolve, reject) {
//                 const buffer = payload.buffer;
//                 const eventId = payload.eventId;
//                 const locationPath = payload.locationPath + "/" + filename;
//                 const exists = serverUtils.ensureDirectoryExistence(locationPath);
//                 if (exists) {
//                     fs.writeFile(locationPath, buffer, (error) => {
//                         if (error) throw error;
//                         log.debug('saved xx-file to :: ' + locationPath);
//                         fs.chmodSync(locationPath, settings.filePermissions);
//                         log.debug('permissions given to xx-file :: ' + locationPath);
//                         delete payload.buffer;
//                         resolve(request)
//                     });
//                 }
//             })
//         }
//         promise(request).then(async function (results) {
//             results.headers = {
//                 ...results.headers,
//                 'content-type': 'application/json'
//             }
//             serverUtils.triggerServerRequest({
//                 request: results,
//                 reply
//             });
//         }).catch(e => {
//             log.error(e);
//             reply(appconfig.defaultError);
//         });
//     } else {
//         reply(appconfig.defaultError);
//     }
// });

// server.route.post('/api/getEventDocuments', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().required(),
//             brand: Joi.string().required(),
//             eventId: Joi.string().required()
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });

// server.route.post('/api/removeEventDocument', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().required(),
//             brand: Joi.string().required(),
//             eventId: Joi.string().required(),
//             documentName: Joi.string().required(),
//             documentId: Joi.string().required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//         transformResponse: (response) => {
//             return response && {
//                 documentId: request.payload.documentId,
//                 ...response.data
//             }
//         }
//     });
//     // reply({
//     //     documentId: request.payload.documentId,
//     //     ...response.data
//     // });
// });

// server.route.post('/api/downloadEventDocument', {
//     tags: ['api']
// }, async (request, reply) => {
//     try {
//         const correlationId = request.headers['x-correlation-id'] + '-' + process.env.INSTANCE_NAME + '-pm' + (process.env.pm_id || 0);
//         const settings = settingsFile[process.env.NODE_ENV];

//         log.debug('download xx-file :: ', request.path, correlationId, request.payload || request.query);
//         const documentName = request.payload.documentName;
//         const eventId = request.payload.eventId;
//         const filePath = `${settings.mount}${settings.verificationDocsDir}${eventId}/`;
//         let filename = filePath + documentName;
//         fs.readFile(filename, (err, bitmap) => {
//             if (err) throw err;
//             log.debug('read xx-file completed.');
//             // log.debug('xx Delete file after response is sent');
//             // fs.unlink(filename, (err) => {
//             //     if (err) throw err;
//             //      log.debug(filename + ' was deleted');
//             // });
//             reply(bitmap)
//         });
//     } catch (error) {
//         log.error(error);
//         reply(error);
//     }
// });