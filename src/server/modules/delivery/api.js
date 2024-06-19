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
        path: '/api/deliveryPreference',
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
                postalCode: Joi.array().required(),
                preferredDeliveryDayOpted: Joi.boolean()
            }),
          }
        }
      },
    ]
}