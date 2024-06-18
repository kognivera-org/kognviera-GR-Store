import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
// import { server, models } from 'hails'
import serverEndpoints from 'server/serverEndpoints';
import serverUtils from '../../../utils/serverUtils';
// const { User } = models
module.exports = function () {
    return [
        {
            method: 'POST',
            path: '/api/eventGiftList/getRegalosRegistrados',
            handler: async (request, reply) => {
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
            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().required(),
                        brand: Joi.string().required(),
                        eventId: Joi.string().required(),
                        searchKeyword: Joi.string().allow(''),
                        priceOrder: Joi.string().allow(''),
                        currentPage: Joi.number().allow(''),
                        priceOrderCategory: Joi.string().allow(''),
                        isShowAll: Joi.string().allow(''),
                    }),
                }
            }
        },{
            method: 'POST',
            path: '/api/eventGiftList/removeItemsFromGiftlist',
            handler: async (request, reply) => {
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
            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().required(),
                        brand: Joi.string().required(),
                        eventId: Joi.string().required(),
                        giftItemIds: Joi.array().items(Joi.string()).required(),
                        currentPage: Joi.number().allow('')
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/eventGiftList/saveQuantity',
            handler: async (request, reply) => {
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
            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().required(),
                        brand: Joi.string().required(),
                        eventId: Joi.string().required(),
                        giftItemId: Joi.string().required(),
                        skuId: Joi.string().required(),
                        quantity: Joi.number().required(),
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/eventGiftList/setFavouriteGift',
            handler: async (request, reply) => {
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
            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().required(),
                        brand: Joi.string().required(),
                        eventId: Joi.string().required(),
                        giftItemId: Joi.string().required(),
                        skuId: Joi.string().required(),
                        isFavourite: Joi.string().required(),
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/eventGiftlist/changeDeliveryMode',
            handler: async (request, reply) => {
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
            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().required(),
                        brand: Joi.string().required(),
                        eventId: Joi.string().required(),
                        modeOfDelivery: Joi.string().required(),
                        giftItemIds: Joi.array().items(Joi.string()).required(),
                        currentPage: Joi.number().allow('')
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/eventGiftlist/changeDeliveryAddress',
            handler: async (request, reply) => {
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
            },
            options: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        channel: Joi.string().required(),
                        brand: Joi.string().required(),
                        eventId: Joi.string().required(),
                        addressId: Joi.string().min(1).required(),
                        giftItemIds: Joi.array().items(Joi.string()).required(),
                        currentPage: Joi.number().allow('')
                    }),
                }
            }
        }
    ]
}

// server.route.post('/api/eventGiftList/getRegalosRegistrados', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().required(),
//             brand: Joi.string().required(),
//             eventId: Joi.string().required(),
//             searchKeyword: Joi.string().allow(''),
//             priceOrder: Joi.string().allow(''),
//             currentPage: Joi.number().allow(''),
//             priceOrderCategory: Joi.string().allow(''),
//             isShowAll: Joi.string().allow(''),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });

// server.route.post('/api/eventGiftList/removeItemsFromGiftlist', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().required(),
//             brand: Joi.string().required(),
//             eventId: Joi.string().required(),
//             giftItemIds: Joi.array().items(Joi.string()).required(),
//             currentPage: Joi.number().allow('')
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });

// server.route.post('/api/eventGiftList/saveQuantity', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().required(),
//             brand: Joi.string().required(),
//             eventId: Joi.string().required(),
//             giftItemId: Joi.string().required(),
//             skuId: Joi.string().required(),
//             quantity: Joi.number().required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });

// server.route.post('/api/eventGiftList/setFavouriteGift', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().required(),
//             brand: Joi.string().required(),
//             eventId: Joi.string().required(),
//             giftItemId: Joi.string().required(),
//             skuId: Joi.string().required(),
//             isFavourite: Joi.string().required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });

// server.route.post('/api/eventGiftlist/changeDeliveryMode', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().required(),
//             brand: Joi.string().required(),
//             eventId: Joi.string().required(),
//             modeOfDelivery: Joi.string().required(),
//             giftItemIds: Joi.array().items(Joi.string()).required(),
//             currentPage: Joi.number().allow('')
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });

// server.route.post('/api/eventGiftlist/changeDeliveryAddress', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().required(),
//             brand: Joi.string().required(),
//             eventId: Joi.string().required(),
//             addressId: Joi.string().min(1).required(),
//             giftItemIds: Joi.array().items(Joi.string()).required(),
//             currentPage: Joi.number().allow('')
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });
