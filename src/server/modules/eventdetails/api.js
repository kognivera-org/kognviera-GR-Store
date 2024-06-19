import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
// import { server, models } from 'hails'
import serverEndpoints from '../../../../src/server/serverEndpoints'
import serverUtils from '../../utils/serverUtils';

// const { User } = models

module.exports = function () {
  return [
    {
      method: 'POST',
      path: '/api/getEventDetails',
      handler: async (request, reply) => {
        let res = await serverUtils.triggerServerRequest({
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
        if (res.header) {
          return reply.response(res.data).header('gr-hostname', res.header)
        }
        else {
            return reply.response(res.data)
        }
      },
      options: {
        tags: ['api']
      }
    },{
      method: 'POST',
      path: '/api/getGiftListGuestView',
      handler: async (request, reply) => {
        let res = await serverUtils.triggerServerRequest({
          request,
          reply,
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
            channel: Joi.string().min(1).required(),
            brand: Joi.string().min(1).required(),
            eventId: Joi.string().min(1).required(),
            currentPage: Joi.string().optional().allow(''), // .min(1).required(),
            categoryId: Joi.string().optional().allow(''),
            priceOrder: Joi.string().optional().allow(''), // .min(1).required(),
            searchKeyword: Joi.string(), // as per new
            isShowAll: Joi.string().optional().allow(''),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/setFavouriteGift',
      handler: async (request, reply) => {
        let res = await serverUtils.triggerServerRequest({
          request,
          reply,
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
            giftItemId: Joi.string().required(),
            skuId: Joi.string().required(),
            isFavourite: Joi.string().required(),
          }),
        }
      }
    },
  ]
}