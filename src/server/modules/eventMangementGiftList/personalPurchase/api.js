
import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
// import { server, models } from 'hails'
import 'babel-polyfill'
import serverUtils from '../../../utils/serverUtils';


module.exports = function () {
    return [
        {
            method: 'POST',
            path: '/api/getComprasPersonales',
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
            path: '/api/updateBonusSelection',
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
                        channel: Joi.string().min(1).required(),
                        brand: Joi.string().min(1).required(),
                        eventId: Joi.string().min(1).required(),
                        itemId: Joi.string().min(1).required(),
                        bonusSelection: Joi.string().min(1).required(),
                    }),
                }
            }
        }
    ]
}

// server.route.post('/api/getComprasPersonales', {
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
// })


// server.route.post('/api/updateBonusSelection', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().min(1).required(),
//             brand: Joi.string().min(1).required(),
//             eventId: Joi.string().min(1).required(),
//             itemId: Joi.string().min(1).required(),
//             bonusSelection: Joi.string().min(1).required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// })


