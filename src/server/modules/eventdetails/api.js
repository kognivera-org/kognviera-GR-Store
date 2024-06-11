import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import { server, models } from 'hails'
import serverEndpoints from '../../../../src/server/serverEndpoints'
import serverUtils from '../../utils/serverUtils';

const { User } = models

server.route.post('/api/getEventDetails', {
  tags: ['api'],
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
    transformResponse: (response) => {
      if (response) {
        const celebrityInfo = response.eventDetailsInfo && response.eventDetailsInfo.celebrityInfo
        celebrityInfo && celebrityInfo.sort((a, b) => b.iscoOwner == 'false' ? 1 : -1);
        return response;
      }
    }
  });
})

server.route.post('/api/getGiftListGuestView', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().min(1).required(),
      brand: Joi.string().min(1).required(),
      eventId: Joi.string().min(1).required(),
      currentPage: Joi.string().optional().allow(''), // .min(1).required(),
      categoryId: Joi.string().optional().allow(''),
      priceOrder: Joi.string().optional().allow(''), // .min(1).required(),
      searchKeyword: Joi.string(), // as per new
      isShowAll: Joi.string().optional().allow(''),

    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
  });
})

server.route.post('/api/setFavouriteGift', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      eventId: Joi.string().required(),
      giftItemId: Joi.string().required(),
      skuId: Joi.string().required(),
      isFavourite: Joi.string().required(),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
  });
})

