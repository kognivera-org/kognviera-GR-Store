import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
import { server, models } from 'hails'
import 'babel-polyfill'
import serverUtils from '../../utils/serverUtils';

module.exports = function () {
    return [
      {
        method: 'POST',
        path: '/api/deliveryPreference',
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
                postalCode: Joi.array().required(),
                preferredDeliveryDayOpted: Joi.boolean()
            }),
          }
        }
      },
    ]
}