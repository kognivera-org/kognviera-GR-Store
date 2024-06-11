import Joi from 'joi';
// import Boom from 'boom';
import axios from 'axios';
import 'babel-polyfill';
import { server } from 'hails';
import serverEndpoints from 'server/serverEndpoints';
import serverUtils from '../../../utils/serverUtils';
// import { server, models } from 'hails';

server.route.post('/api/getClosingGiftPriceRange', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required()
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});