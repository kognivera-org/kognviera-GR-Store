import Joi from 'joi';
import Boom from 'boom';
import axios from 'axios';
import serverEndpoints from '../../serverEndpoints';
// import { server, models } from 'hails';
import fs from 'fs';
import serverUtils from '../../utils/serverUtils'

// const { User } = models;

module.exports = function () {
    return [
        {
            method: 'GET',
            path: '/api/buildReportPage',
            handler: async (request, reply) => {
                let res =  await serverUtils.triggerServerRequest({
                    request,
                    reply,
                    cacheKey: request.query.storeUserRole                     
                });
                if(res.header)
                    {
                        return reply.response(res.data).header('gr-hostname', res.header)
                         
                    }
                    else 
                    {
                        return reply.response(res.data)
                    }
            },
            options: {
                tags: ['api'],                 
            }
        },
        {
            method: 'POST',
            path: '/api/listUserFavoriteReports',
            handler: async (request, reply) => {
                let res =  await serverUtils.triggerServerRequest({
                    request,
                    reply
                                  
                });
                if(res.header)
                    {
                        return reply.response(res.data).header('gr-hostname', res.header)
                         
                    }
                    else 
                    {
                        return reply.response(res.data)
                    }
            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        agentProfileId: Joi.string().required(),
                        channel: Joi.string().required(),
                        brand: Joi.string().required()
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/saveFavoriteReports',
            handler: async (request, reply) => {
                let res =  await serverUtils.triggerServerRequest({
                    request,
                    reply
                                  
                });
                if(res.header)
                    {
                        return reply.response(res.data).header('gr-hostname', res.header)
                         
                    }
                    else 
                    {
                        return reply.response(res.data)
                    }
            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        agentProfileId: Joi.string().required(),
                        favReportId: Joi.string().allow(''),
                        favReportName: Joi.string().allow(''),
                        isUpdateRequest: Joi.boolean(),
                        userSelection: Joi.object(),
                        brand: Joi.string().required(),
                        channel: Joi.string().required()
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/deleteFavoriteReport',
            handler: async (request, reply) => {
                let res =  await serverUtils.triggerServerRequest({
                    request,
                    reply
                                  
                });
                if(res.header)
                    {
                        return reply.response(res.data).header('gr-hostname', res.header)
                         
                    }
                    else 
                    {
                        return reply.response(res.data)
                    }
            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        favReportId: Joi.string().required(),
                        agentProfileId: Joi.string().required(),
                        channel: Joi.string().required(),
                        brand: Joi.string().required()
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/retrieveFavoriteSelection',
            handler: async (request, reply) => {
                let res =  await serverUtils.triggerServerRequest({
                    request,
                    reply
                                  
                });
                if(res.header)
                    {
                        return reply.response(res.data).header('gr-hostname', res.header)
                         
                    }
                    else 
                    {
                        return reply.response(res.data)
                    }
            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        favReportId: Joi.string().required(),
                        agentProfileId: Joi.string().required(),
                        channel: Joi.string().required(),
                        brand: Joi.string().required()
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/generateReport',
            handler: async (request, reply) => {
                let res =  await serverUtils.triggerServerRequest({
                    request,
                    reply,
                    timeout: 180000,
                    transformRequest: requestObj => {
                        const request = requestObj.payload;
                        if (!request.startDate) {
                            request.startDate = '1999/01/01';
                        }
                        if (!request.endDate) {
                            request.endDate = '1999/01/01';
                        }
                        return requestObj;
                    },
                });
                if(res.header)
                    {
                        return reply.response(res.data).header('gr-hostname', res.header)
                         
                    }
                    else 
                    {
                        return reply.response(res.data)
                    }
            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        allBrandsSelected: Joi.string().required(),
                        allEventsSelected: Joi.string().required(),
                        allStoresSelected: Joi.string().required(),
                        allZonesSelected: Joi.string().required(),
                        brand: Joi.string().required(),
                        channel: Joi.string().required(),

                        isDetailedReport: Joi.string().required(),
                        isEmployeeEvent: Joi.string().required(),
                        isTimeComparisonReport: Joi.string().required(),
                        reportTypeId: Joi.string().required(),
                        reportTypeName: Joi.string().required(),

                        transactionId: Joi.string().required(),

                        startDate: Joi.string().optional(),
                        endDate: Joi.string().optional(),
                        compareStartDate: Joi.string().optional(),
                        compareEndDate: Joi.string().optional(),

                        brandIds: Joi.array(),
                        brandNames: Joi.array(),
                        eventTypes: Joi.array(),
                        storeIds: Joi.array(),
                        storeNames: Joi.array(),
                        zoneIds: Joi.array(),
                        zoneNames: Joi.array(), 
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/generateReportFile',
            handler: async (request, reply) => {
                try {
                    const filePath = request.payload.filePath;
                    if (fs.existsSync(filePath)) {
                        fs.readFile(filePath, (err) => {
                            if (err) throw err;
                            var bitmap = fs.readFileSync(filePath);
                            return reply.response(bitmap)
                        });
                    } else {
                        // console.log("File not present>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", filePath);
                        return reply.response({
                            statusCode: 200,
                            message: "File not created yet",
                            fileNotFound: true
                        })
            
                        //reply(Boom.notFound());
                    }
            
                } catch (error) {
                    return reply.response(error);
                }
            },
            options: {
                tags: ['api'],                 
            }
        } 

    ]
}




// server.route.get('/api/buildReportPage', {
//     tags: ['api'],
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//         cacheKey: request.query.storeUserRole
//     });

// });

// server.route.post('/api/listUserFavoriteReports', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             agentProfileId: Joi.string().required(),
//             channel: Joi.string().required(),
//             brand: Joi.string().required()
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });

// server.route.post('/api/saveFavoriteReports', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             agentProfileId: Joi.string().required(),
//             favReportId: Joi.string().allow(''),
//             favReportName: Joi.string().allow(''),
//             isUpdateRequest: Joi.boolean(),
//             userSelection: Joi.object(),
//             brand: Joi.string().required(),
//             channel: Joi.string().required()
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });

// server.route.post('/api/deleteFavoriteReport', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             favReportId: Joi.string().required(),
//             agentProfileId: Joi.string().required(),
//             channel: Joi.string().required(),
//             brand: Joi.string().required()
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });

// server.route.post('/api/retrieveFavoriteSelection', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             favReportId: Joi.string().required(),
//             agentProfileId: Joi.string().required(),
//             channel: Joi.string().required(),
//             brand: Joi.string().required()
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });

// server.route.post('/api/generateReport', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             allBrandsSelected: Joi.string().required(),
//             allEventsSelected: Joi.string().required(),
//             allStoresSelected: Joi.string().required(),
//             allZonesSelected: Joi.string().required(),
//             brand: Joi.string().required(),
//             channel: Joi.string().required(),

//             isDetailedReport: Joi.string().required(),
//             isEmployeeEvent: Joi.string().required(),
//             isTimeComparisonReport: Joi.string().required(),
//             reportTypeId: Joi.string().required(),
//             reportTypeName: Joi.string().required(),

//             transactionId: Joi.string().required(),

//             startDate: Joi.string().optional(),
//             endDate: Joi.string().optional(),
//             compareStartDate: Joi.string().optional(),
//             compareEndDate: Joi.string().optional(),

//             brandIds: Joi.array(),
//             brandNames: Joi.array(),
//             eventTypes: Joi.array(),
//             storeIds: Joi.array(),
//             storeNames: Joi.array(),
//             zoneIds: Joi.array(),
//             zoneNames: Joi.array(),


//             // favReportId: Joi.string().required(),
//             // agentProfileId: Joi.string().required(),
//             // channel: Joi.string().required()
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//         timeout: 180000,
//         transformRequest: requestObj => {
//             const request = requestObj.payload;
//             if (!request.startDate) {
//                 request.startDate = '1999/01/01';
//             }
//             if (!request.endDate) {
//                 request.endDate = '1999/01/01';
//             }
//             return requestObj;
//         },
//     });
// });

// server.route.post('/api/generateReportFile', {
//     tags: ['api']
// }, async (request, reply) => {
//     try {
//         const filePath = request.payload.filePath;
//         if (fs.existsSync(filePath)) {
//             fs.readFile(filePath, (err) => {
//                 if (err) throw err;
//                 var bitmap = fs.readFileSync(filePath);
//                 reply(bitmap)
//             });
//         } else {
//             // console.log("File not present>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", filePath);
//             reply({
//                 statusCode: 200,
//                 message: "File not created yet",
//                 fileNotFound: true
//             })

//             //reply(Boom.notFound());
//         }

//     } catch (error) {
//         reply(error);
//     }
// });