import Joi from 'joi'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
import { server, models } from 'hails'
import serverUtils from '../../utils/serverUtils';

server.route.post('/api/getActivityLog', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            performedUserId: Joi.string().required(),
            viewCompleteLog: Joi.string().required(),
            filterParam: Joi.string().optional().allow(),
        }
    }
}, (request, reply) => {
    request.path = '/api/daytrack';
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});