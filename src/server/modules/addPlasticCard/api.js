import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
import { server, models } from 'hails'
import serverUtils from '../../utils/serverUtils';
const { User } = models

server.route.post('/api/addDilisaCard', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            plasticCardNumber: Joi.string().required(),
            eventId: Joi.string().required(),
            ownerId: Joi.string().required()
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});