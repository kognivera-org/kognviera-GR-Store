import axios from 'axios'
import Joi from 'joi'
import Boom from 'boom'
import { server, models } from 'hails'
import serverEndpoints from '../../../server/serverEndpoints'
import serverUtils from '../../utils/serverUtils'

const { User } = models

server.route.post('/api/addPredeterminedItem', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      predeterminedItemId: Joi.string().required(),
      eventId: Joi.string().required(),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
  });
})

server.route.post('/api/predeterminedLandingPage', {
  tags: ['api'],
  validate: {
    payload: {
      eventType: Joi.string().required(),
      channel: Joi.string().required(),
      brand: Joi.string().required(),

    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
    cacheKey: request.payload.eventType
  });
})

server.route.post('/api/getPredeterminedListPageHeaderInfo', {
  tags: ['api'],
  validate: {
    payload: {
      predeterminedListId: Joi.string().required(),
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      // categoryId: Joi.string().optional(),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
    cacheKey: request.payload.eventType
  });
})

server.route.post('/api/predeterminedListPageItemsInfo', {
  tags: ['api'],
  validate: {
    payload: {
      predeterminedListId: Joi.string().required(),
      currentPage: Joi.string().required(),
      categoryId: Joi.string().optional(),
      priceOrder: Joi.string().optional(),
      channel: Joi.string().required(),
      brand: Joi.string().required(),

    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
    cacheKey: request.payload.eventType
  });
})
