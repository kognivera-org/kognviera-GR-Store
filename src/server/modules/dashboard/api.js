import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
//import { server, models } from 'hails'
import Datetime from 'lib/datetime/DateTime';
import serverUtils from '../../utils/serverUtils';

module.exports = function () {
    return [
      
        {
            method: 'POST',
            path: '/api/getStateList',
            handler: async (request, reply) => {
                //request.payload.brand = 'LP';
                //request.payload.channel = 'web';
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

                //console.log("======,abc===",abc)
            },
            options: {
                tags: ['api'],
                validate: {
                  payload: Joi.object({
                    channel: Joi.string().required(),
                    brand: Joi.string().required(),
                    searchType: Joi.string().required(),
                  }),
                }
              }
            

      },
      {
             method: 'POST',
            path: '/api/getStoreList',
            handler: async (request, reply) => {
                let res = await serverUtils.triggerServerRequest({
                    request,
                    reply,
                    cacheKey: request.payload.searchType + '_' + request.payload.stateId
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
                    stateId: Joi.string().required(),
                    searchType: Joi.string().required(),
                  }),
                }
             }

      }
      
    ]
    
}


// server.route.post('/api/getStateList', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             channel: Joi.string().required(),
//             brand: Joi.string().required(),
//             searchType: Joi.string().required(),
//         },
//     },
// }, (request, reply) => {
//     //request.payload.brand = 'LP';
//     //request.payload.channel = 'web';
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//         cacheKey: request.payload.searchType
//     });
// });

