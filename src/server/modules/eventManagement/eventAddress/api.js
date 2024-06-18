import Joi from 'joi';
// import Boom from 'boom';
import axios from 'axios';
import 'babel-polyfill';
import { server } from 'hails';
import serverEndpoints from 'server/serverEndpoints';
// import { server, models } from 'hails';
import serverUtils from '../../../utils/serverUtils';

module.exports = function () {
    return [
      {
        method: 'POST',
        path: '/api/getEventDeliveryAddresses',
        handler: async (request, reply) => {
            serverUtils.triggerServerRequest({
                request,
                reply,
            });
        },
        options: {
          tags: ['api'],
          validate: {
            payload: Joi.object({
                channel: Joi.string().required(),
                brand: Joi.string().required(),
                eventId: Joi.string().required(),
            }),
          }
        }
      },{
        method: 'POST',
        path: '/api/deleteDeliveryAddresses',
        handler: async (request, reply) => {
            serverUtils.triggerServerRequest({
                request,
                reply,
            });
        },
        options: {
          tags: ['api'],
          validate: {
            payload: Joi.object({
                channel: Joi.string().required(),
                brand: Joi.string().required(),
                eventId: Joi.string().required(),
                addressId: Joi.string().required(),
            }),
          }
        }
      },{
        method: 'POST',
        path: '/api/assignAddress',
        handler: async (request, reply) => {
            serverUtils.triggerServerRequest({
                request,
                reply,
            });
        },
        options: {
          tags: ['api'],
          validate: {
            payload: Joi.object({
                brand: Joi.string().required(),
                channel: Joi.string().required(),
                eventId: Joi.string().required(),
                addressId1: Joi.string().required(),
                celebrityId1: Joi.string().required(),
                addressId2: Joi.string().allow(''),
                celebrityId2: Joi.string().allow(''),
                addressId3: Joi.string().allow(''),
                celebrityId3: Joi.string().allow(''),
            }),
          }
        }
      },
    ]
}


