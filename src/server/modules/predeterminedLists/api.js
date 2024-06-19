import axios from 'axios'
import Joi from 'joi'
import Boom from 'boom'
// import { server, models } from 'hails'
import serverEndpoints from '../../../server/serverEndpoints'
import serverUtils from '../../utils/serverUtils'

// const { User } = models

module.exports = function () {
  return [
      {
          method: 'POST',
          path: '/api/addPredeterminedItem',
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
                    channel: Joi.string().required(),
                    brand: Joi.string().required(),
                    predeterminedItemId: Joi.string().required(),
                    eventId: Joi.string().required(),
                  }),
              }
          }
      },
      {
        method: 'POST',
        path: '/api/predeterminedLandingPage',
        handler: async (request, reply) => {
          let res =  await serverUtils.triggerServerRequest({
            request,
            reply,
            cacheKey: request.payload.eventType             
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
                  eventType: Joi.string().required(),
                  channel: Joi.string().required(),
                  brand: Joi.string().required(),

                }),
            }
        }
    },
    {
      method: 'POST',
      path: '/api/getPredeterminedListPageHeaderInfo',
      handler: async (request, reply) => {
        let res =  await serverUtils.triggerServerRequest({
          request,
          reply,
          cacheKey: request.payload.eventType           
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
                predeterminedListId: Joi.string().required(),
                channel: Joi.string().required(),
                brand: Joi.string().required(),

              }),
          }
      }
  },
  {
    method: 'POST',
    path: '/api/predeterminedListPageItemsInfo',
    handler: async (request, reply) => {
      let res =  await serverUtils.triggerServerRequest({
        request,
        reply,
        cacheKey: request.payload.eventType           
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
              predeterminedListId: Joi.string().required(),
              currentPage: Joi.string().required(),
              categoryId: Joi.string().optional(),
              priceOrder: Joi.string().optional(),
              channel: Joi.string().required(),
              brand: Joi.string().required(),

            }),
        }
    }
  },

  ]
}
// server.route.post('/api/addPredeterminedItem', {
//   tags: ['api'],
//   validate: {
//     payload: {
//       channel: Joi.string().required(),
//       brand: Joi.string().required(),
//       predeterminedItemId: Joi.string().required(),
//       eventId: Joi.string().required(),
//     },
//   },
// }, (request, reply) => {
//   serverUtils.triggerServerRequest({
//     request,
//     reply,
//   });
// })

// server.route.post('/api/predeterminedLandingPage', {
//   tags: ['api'],
//   validate: {
//     payload: {
//       eventType: Joi.string().required(),
//       channel: Joi.string().required(),
//       brand: Joi.string().required(),

//     },
//   },
// }, (request, reply) => {
//   serverUtils.triggerServerRequest({
//     request,
//     reply,
//     cacheKey: request.payload.eventType
//   });
// })

// server.route.post('/api/getPredeterminedListPageHeaderInfo', {
//   tags: ['api'],
//   validate: {
//     payload: {
//       predeterminedListId: Joi.string().required(),
//       channel: Joi.string().required(),
//       brand: Joi.string().required(),
//       // categoryId: Joi.string().optional(),
//     },
//   },
// }, (request, reply) => {
//   serverUtils.triggerServerRequest({
//     request,
//     reply,
//     cacheKey: request.payload.eventType
//   });
// })

// server.route.post('/api/predeterminedListPageItemsInfo', {
//   tags: ['api'],
//   validate: {
//     payload: {
//       predeterminedListId: Joi.string().required(),
//       currentPage: Joi.string().required(),
//       categoryId: Joi.string().optional(),
//       priceOrder: Joi.string().optional(),
//       channel: Joi.string().required(),
//       brand: Joi.string().required(),

//     },
//   },
// }, (request, reply) => {
//   serverUtils.triggerServerRequest({
//     request,
//     reply,
//     cacheKey: request.payload.eventType
//   });
// })
