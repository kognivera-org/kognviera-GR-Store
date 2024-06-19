import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints'
// import { server } from 'hails'
import 'babel-polyfill'
import serverUtils from '../../../utils/serverUtils';

module.exports = function () {
    return [
      {
        method: 'POST',
        path: '/api/getEditEventInfo',
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
                profileId: Joi.string().required(),
            }),
          }
        }
      },{
        method: 'POST',
        path: '/api/saveEventName',
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
                eventName: Joi.string().required(),
            }),
          }
        }
      },{
        method: 'POST',
        path: '/api/deleteAdministrator',
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
                ownerId: Joi.string().required(),
            }),
          }
        }
      },
    ]
}
