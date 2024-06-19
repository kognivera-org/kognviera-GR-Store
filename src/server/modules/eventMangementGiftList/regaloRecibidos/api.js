
import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
// import { server, models } from 'hails'
import 'babel-polyfill';
import serverUtils from '../../../utils/serverUtils';


module.exports = function () {
    return [
        {
            method: 'POST',
            path: '/api/getRegaloRecibidos',
            handler: async (request, reply) => {
                let res = await serverUtils.triggerServerRequest({
                    request,
                    reply
                });
                if (res.header) {
                    return reply.response(res.data).header('gr-hostname', res.header)

                }
                else {
                    return reply.response(res.data)
                }
            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().min(1).required(),
                        brand: Joi.string().min(1).required(),
                        eventId: Joi.string().min(1).required(),
                        filteringParameters: Joi.array().items(Joi.object()),
                        priceOrder: Joi.string().optional().allow(''),
                        searchKeyword: Joi.string().optional().allow(''),
                        currentPage: Joi.number().allow(''),
                        isShowAll: Joi.string().optional().allow(''),
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/getPurchaseTicketDetails',
            handler: async (request, reply) => {
                let res = await serverUtils.triggerServerRequest({
                    request,
                    reply
                });
                if (res.header) {
                    return reply.response(res.data).header('gr-hostname', res.header)

                }
                else {
                    return reply.response(res.data)
                }

            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().min(1).required(),
                        brand: Joi.string().min(1).required(),
                        eventId: Joi.string().min(1).required(),
                        boletaNumber: Joi.string().min(1).required(),
                        tiendaNumber: Joi.string().min(1).required(),
                        terminalNumber: Joi.string().min(1).required(),
                        authCode: Joi.string().min(1).required(),
                        actionType: Joi.string().min(1).required(),
                        purchasedDate: Joi.string().optional().allow(''),
                        skuId: Joi.string().optional().allow(''),
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/getTrackOrder',
            handler: async (request, reply) => {

                let res = await serverUtils.triggerServerRequest({
                    request,
                    reply
                });
                if (res.header) {
                    return reply.response(res.data).header('gr-hostname', res.header)

                }
                else {
                    return reply.response(res.data)
                }

            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().min(1).required(),
                        brand: Joi.string().min(1).required(),
                        eventId: Joi.string().min(1).required(),
                        pedidoNo: Joi.string().min(1).required(),
                        itemId: Joi.string().optional().allow(''),
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/associatePurchaseTicket',
            handler: async (request, reply) => {

                let res = await serverUtils.triggerServerRequest({
                    request,
                    reply
                });
                if (res.header) {
                    return reply.response(res.data).header('gr-hostname', res.header)

                }
                else {
                    return reply.response(res.data)
                }

            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().min(1).required(),
                        brand: Joi.string().min(1).required(),
                        eventId: Joi.string().min(1).required(),
                        boletaNumber: Joi.string().min(1).required(),
                        empresaId: Joi.string().min(1).required(),
                        purchaseDate: Joi.string().min(1).required(),
                        purchaserName: Joi.string().optional().allow(''),
                        terminalNumber: Joi.string().min(1).required(),
                        tiendaNumber: Joi.string().min(1).required(),
                        personalPurchase: Joi.string().min(1).required(),
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/dissociatePurchaseTicket',
            handler: async (request, reply) => {

                let res = await serverUtils.triggerServerRequest({
                    request,
                    reply
                });
                if (res.header) {
                    return reply.response(res.data).header('gr-hostname', res.header)

                }
                else {
                    return reply.response(res.data)
                }

            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().min(1).required(),
                        brand: Joi.string().min(1).required(),
                        eventId: Joi.string().min(1).required(),
                        boletaNumber: Joi.string().min(1).required(),
                        empresaId: Joi.string().min(1).required(),
                        purchaseDate: Joi.string().min(1).required(),
                        purchaserName: Joi.string().optional().allow(''),
                        terminalNumber: Joi.string().min(1).required(),
                        tiendaNumber: Joi.string().min(1).required(),
                        personalPurchase: Joi.string().min(1).required(),
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/disassociatePurchasedTicketByButton',
            handler: async (request, reply) => {

                let res = await serverUtils.triggerServerRequest({
                    request,
                    reply
                });
                if (res.header) {
                    return reply.response(res.data).header('gr-hostname', res.header)

                }
                else {
                    return reply.response(res.data)
                }

            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().min(1).required(),
                        brand: Joi.string().min(1).required(),
                        eventId: Joi.string().min(1).required(),
                        purchaseTicketId: Joi.string().min(1).required(),
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/getMessages',
            handler: async (request, reply) => {

                let res = await serverUtils.triggerServerRequest({
                    request,
                    reply
                });
                if (res.header) {
                    return reply.response(res.data).header('gr-hostname', res.header)

                }
                else {
                    return reply.response(res.data)
                }

            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().min(1).required(),
                        brand: Joi.string().min(1).required(),
                        eventId: Joi.string().min(1).required(),
                        itemId: Joi.string().min(1).required(),
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/addMessage',
            handler: async (request, reply) => {

                let res = await serverUtils.triggerServerRequest({
                    request,
                    reply,
                    transformRequest: requestObj => {
                        requestObj.payload.emailId = requestObj.payload.emailId && requestObj.payload.emailId.toLowerCase()
                        return requestObj;
                    },
                });
                if (res.header) {
                    return reply.response(res.data).header('gr-hostname', res.header)

                }
                else {
                    return reply.response(res.data)
                }

            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().min(1).required(),
                        brand: Joi.string().min(1).required(),
                        eventId: Joi.string().min(1).required(),
                        itemId: Joi.string().min(1).required(),
                        guestName: Joi.string().min(1).required(),
                        emailId: Joi.string().optional().allow(''),
                        message: Joi.string().optional().allow(''),
                    }),
                }
            }
        }, {
            method: 'POST',
            path: '/api/deleteMessage',
            handler: async (request, reply) => {

                let res = await serverUtils.triggerServerRequest({
                    request,
                    reply
                });
                if (res.header) {
                    return reply.response(res.data).header('gr-hostname', res.header)

                }
                else {
                    return reply.response(res.data)
                }

            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().min(1).required(),
                        brand: Joi.string().min(1).required(),
                        eventId: Joi.string().min(1).required(),
                        itemId: Joi.string().min(1).required(),
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/savePurchaserName',
            handler: async (request, reply) => {

                let res = await serverUtils.triggerServerRequest({
                    request,
                    reply
                });
                if (res.header) {
                    return reply.response(res.data).header('gr-hostname', res.header)

                }
                else {
                    return reply.response(res.data)
                }

            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().min(1).required(),
                        brand: Joi.string().min(1).required(),
                        eventId: Joi.string().min(1).required(),
                        purchaseTicketId: Joi.string().min(1).required(),
                        purchaserName: Joi.string().min(1).required(),
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/addAgainGiftItem',
            handler: async (request, reply) => {

                let res = await serverUtils.triggerServerRequest({
                    request,
                    reply
                });
                if (res.header) {
                    return reply.response(res.data).header('gr-hostname', res.header)

                }
                else {
                    return reply.response(res.data)
                }

            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().min(1).required(),
                        brand: Joi.string().min(1).required(),
                        eventId: Joi.string().min(1).required(),
                        skuId: Joi.string().min(1).required(),
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/getReceivedGiftsMessages',
            handler: async (request, reply) => {

                let res = await serverUtils.triggerServerRequest({
                    request,
                    reply
                });
                if (res.header) {
                    return reply.response(res.data).header('gr-hostname', res.header)

                }
                else {
                    return reply.response(res.data)
                }

            },
            options: {
                tags: ['api']
            }
        }
    ]
}

//commenting old approach
// server.route.post('/api/getRegaloRecibidos', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().min(1).required(),
//             brand: Joi.string().min(1).required(),
//             eventId: Joi.string().min(1).required(),
//             filteringParameters: Joi.array().items(Joi.object()),
//             priceOrder: Joi.string().optional().allow(''),
//             searchKeyword: Joi.string().optional().allow(''),
//             currentPage: Joi.number().allow(''),
//             isShowAll: Joi.string().optional().allow(''),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });
// server.route.post('/api/getPurchaseTicketDetails', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().min(1).required(),
//             brand: Joi.string().min(1).required(),
//             eventId: Joi.string().min(1).required(),
//             boletaNumber: Joi.string().min(1).required(),
//             tiendaNumber: Joi.string().min(1).required(),
//             terminalNumber: Joi.string().min(1).required(),
//             authCode: Joi.string().min(1).required(),
//             actionType: Joi.string().min(1).required(),
//             purchasedDate: Joi.string().optional().allow(''),
//             skuId: Joi.string().optional().allow(''),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });
// server.route.post('/api/getTrackOrder', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().min(1).required(),
//             brand: Joi.string().min(1).required(),
//             eventId: Joi.string().min(1).required(),
//             pedidoNo: Joi.string().min(1).required(),
//             itemId: Joi.string().optional().allow(''),

//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });
// server.route.post('/api/associatePurchaseTicket', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().min(1).required(),
//             brand: Joi.string().min(1).required(),
//             eventId: Joi.string().min(1).required(),
//             boletaNumber: Joi.string().min(1).required(),
//             empresaId: Joi.string().min(1).required(),
//             purchaseDate: Joi.string().min(1).required(),
//             purchaserName: Joi.string().optional().allow(''),
//             terminalNumber: Joi.string().min(1).required(),
//             tiendaNumber: Joi.string().min(1).required(),
//             personalPurchase: Joi.string().min(1).required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });
// server.route.post('/api/dissociatePurchaseTicket', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().min(1).required(),
//             brand: Joi.string().min(1).required(),
//             eventId: Joi.string().min(1).required(),
//             boletaNumber: Joi.string().min(1).required(),
//             empresaId: Joi.string().min(1).required(),
//             purchaseDate: Joi.string().min(1).required(),
//             purchaserName: Joi.string().optional().allow(''),
//             terminalNumber: Joi.string().min(1).required(),
//             tiendaNumber: Joi.string().min(1).required(),
//             personalPurchase: Joi.string().min(1).required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });
// server.route.post('/api/disassociatePurchasedTicketByButton', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().min(1).required(),
//             brand: Joi.string().min(1).required(),
//             eventId: Joi.string().min(1).required(),
//             purchaseTicketId: Joi.string().min(1).required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });

// server.route.post('/api/getMessages', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().min(1).required(),
//             brand: Joi.string().min(1).required(),
//             eventId: Joi.string().min(1).required(),
//             itemId: Joi.string().min(1).required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });
// server.route.post('/api/addMessage', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().min(1).required(),
//             brand: Joi.string().min(1).required(),
//             eventId: Joi.string().min(1).required(),
//             itemId: Joi.string().min(1).required(),
//             guestName: Joi.string().min(1).required(),
//             emailId: Joi.string().optional().allow(''),
//             message: Joi.string().optional().allow(''),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//         transformRequest: requestObj => {
//             requestObj.payload.emailId = requestObj.payload.emailId && requestObj.payload.emailId.toLowerCase()
//             return requestObj;
//         },
//     });
// });
// server.route.post('/api/deleteMessage', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().min(1).required(),
//             brand: Joi.string().min(1).required(),
//             eventId: Joi.string().min(1).required(),
//             itemId: Joi.string().min(1).required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });
// server.route.post('/api/savePurchaserName', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().min(1).required(),
//             brand: Joi.string().min(1).required(),
//             eventId: Joi.string().min(1).required(),
//             purchaseTicketId: Joi.string().min(1).required(),
//             purchaserName: Joi.string().min(1).required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });
// server.route.post('/api/addAgainGiftItem', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().min(1).required(),
//             brand: Joi.string().min(1).required(),
//             eventId: Joi.string().min(1).required(),
//             skuId: Joi.string().min(1).required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });


// server.route.post('/api/getReceivedGiftsMessages', {
//     tags: ['api'],

// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });

// });