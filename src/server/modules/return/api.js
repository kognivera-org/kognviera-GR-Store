import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
// import { server, models } from 'hails'
import 'babel-polyfill';
import serverUtils from '../../utils/serverUtils'

module.exports = function () {
    return [
        {
            method: 'POST',
            path: '/api/getInitiateReturnList',
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
                        eventId: Joi.string().required(),
                        brand: Joi.string().required(),
                        sessionInvalidate: Joi.string().optional(),
                        initiateReturnList: Joi.array().required(),
                    }),
                }
            }
        },
        {
            method: 'POST',
            path: '/api/deleteReturnItem',
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
                        purchaseItemId: Joi.string().required()
                    }),
                }
            }
        }
    ]
}
// server.route.post('/api/getInitiateReturnList', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().required(),
//             eventId: Joi.string().required(),
//             brand: Joi.string().required(),
//             sessionInvalidate: Joi.string().optional(),
//             initiateReturnList: Joi.array().required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });




// server.route.post('/api/deleteReturnItem', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().required(),
//             brand: Joi.string().required(),
//             purchaseItemId: Joi.string().required()
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });
// });


