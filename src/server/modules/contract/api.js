import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
import { server, models } from 'hails'
import 'babel-polyfill'
import serverUtils from '../../utils/serverUtils';

server.route.post('/api/contract', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      eventType: Joi.string().required(),
      eventDate: Joi.string().allow(''),
      eventId: Joi.string().allow(''),
      isEmployee: Joi.string().allow(''),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
    cacheKey: `${request.payload.eventType}_${request.payload.isEmployee}`
  });
})

