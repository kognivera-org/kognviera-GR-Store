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
        path: '/api/createNotes',
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
                note: Joi.string().required(),
            }),
          }
        }
      },{
        method: 'POST',
        path: '/api/displayNotes',
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
                eventId: Joi.string().required()
            }),
          }
        }
      },{
        method: 'POST',
        path: '/api/deleteNotes',
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
                selectedNoteId: Joi.string().required()
            }),
          }
        }
      },
    ]
}