import Joi from 'joi';
// import Boom from 'boom';
import axios from 'axios';
import 'babel-polyfill';
// import { server } from 'hails';
import serverEndpoints from 'server/serverEndpoints';
// import { server, models } from 'hails';
import serverUtils from '../../../utils/serverUtils';

module.exports = function () {
  return [
    {
      method: 'POST',
      path: '/api/fetchPlasticCards',
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
      }
    },
    {
      method: 'POST',
      path: '/api/deletePlasticCards',
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
            hannel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            ownerId: Joi.string().required(),
            plasticCardNumber: Joi.string().required(),
          }),
        }
      }
    },
    {
      method: 'POST',
      path: '/api/addPlasticCard',
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
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            ownerId: Joi.string().required(),
            plasticCardNumber: Joi.string().required(),
          }),
        }
      }
    }
  ]
}
// server.route.post('/api/fetchPlasticCards', {
//   tags: ['api'],

// }, (request, reply) => {
//   serverUtils.triggerServerRequest({
//     request,
//     reply,
//   });
// });
// server.route.post('/api/deletePlasticCards', {
//   tags: ['api'],
//   validate: {
//     payload: {
//       channel: Joi.string().required(),
//       brand: Joi.string().required(),
//       eventId: Joi.string().required(),
//       ownerId: Joi.string().required(),
//       plasticCardNumber: Joi.string().required(),
//     },
//   },
// }, (request, reply) => {
//   serverUtils.triggerServerRequest({
//     request,
//     reply,
//   });
// });


// server.route.post('/api/addPlasticCard', {
//   tags: ['api'],
//   validate: {
//     payload: {
//       channel: Joi.string().required(),
//       brand: Joi.string().required(),
//       eventId: Joi.string().required(),
//       ownerId: Joi.string().required(),
//       plasticCardNumber: Joi.string().required(),
//     },
//   },
// }, (request, reply) => {
//   serverUtils.triggerServerRequest({
//     request,
//     reply,
//   });
// });
