import Joi from 'joi';
import Boom from 'boom';
import axios from 'axios';
// import { server, models } from 'hails';
import serverEndpoints from 'server/serverEndpoints';
import serverUtils from '../../../utils/serverUtils';

// const { User } = models;
module.exports = function () {
    return [
        {
            method: 'POST',
            path: '/api/eventGiftList/addGiftItemBySKUID',
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
                        channel: Joi.string().min(1).required(),
                        brand: Joi.string().required(),
                        eventId: Joi.string().required(),
                        skuId: Joi.string().required(),
                        quantity: Joi.string().required(),
                        deliveryMode: Joi.string().required(),
                    }),
                }
            }
        }
    ]
}

// server.route.post('/api/eventGiftList/addGiftItemBySKUID', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().min(1).required(),
//             brand: Joi.string().required(),
//             eventId: Joi.string().required(),
//             skuId: Joi.string().required(),
//             quantity: Joi.string().required(),
//             deliveryMode: Joi.string().required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });
