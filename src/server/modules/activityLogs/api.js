import Joi from 'joi'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
import { server, models } from 'hails'
import serverUtils from '../../utils/serverUtils';

module.exports = function () {
    return [
      {
        method: 'POST',
        path: '/api/getActivityLog',
        handler: async (request, reply) => {
            request.path = '/api/daytrack';
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
                performedUserId: Joi.string().required(),
                viewCompleteLog: Joi.string().required(),
                filterParam: Joi.string().optional().allow(),
            }),
          }
        }
      },
    ]
}