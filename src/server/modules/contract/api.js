import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
// import { server, models } from 'hails'
import 'babel-polyfill'
import serverUtils from '../../utils/serverUtils';

module.exports = function () {
  return [
    {
      method: 'POST',
      path: '/api/contract',
      handler: async (request, reply) => {
        serverUtils.triggerServerRequest({
          request,
          reply,
          cacheKey: `${request.payload.eventType}_${request.payload.isEmployee}`
        });
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventType: Joi.string().required(),
            eventDate: Joi.string().allow(''),
            eventId: Joi.string().allow(''),
            isEmployee: Joi.string().allow(''),
          }),
        }
      }
    },
  ]
}
