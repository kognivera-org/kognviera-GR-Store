import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
// import { server, models } from 'hails'
import 'babel-polyfill'
import serverUtils from '../../../utils/serverUtils';

module.exports = function () {
    return [
      {
        method: 'POST',
        path: '/api/displayEventStatusDropdown',
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
        path: '/api/changeEmployeeEvent',
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
                employeeEventFlag: Joi.string().required(),
            }),
          }
        }
      },{
        method: 'POST',
        path: '/api/changeEventStatus',
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
                selectedEventStatus: Joi.string().required(),
                isSuspendedForPeriod: Joi.string().required(),
                newEventDate: Joi.string().allow(),
                suspensionInfo: Joi.object().allow().keys({
                    eventDate: Joi.string().required(),
                    range: Joi.object().allow().keys({
                        startDate: [Joi.string().allow('')],
                        endDate: [Joi.string().allow('')],
                    })
                })
            }),
          }
        }
      },{
        method: 'POST',
        path: '/api/setOwnerDetailsInSession',
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
                isConsultant: Joi.boolean().required(),
                ownerId: [Joi.string().allow('')],
                profileId: [Joi.string().allow('')],
                eventId: [Joi.string().allow('')]
            }),
          }
        }
      },
    ]
}