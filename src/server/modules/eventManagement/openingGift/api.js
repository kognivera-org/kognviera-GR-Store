import Joi from 'joi';
// import Boom from 'boom';
import axios from 'axios';
import 'babel-polyfill';
import { server } from 'hails';
import serverEndpoints from 'server/serverEndpoints';
// import { server, models } from 'hails';
import serverUtils from '../../../utils/serverUtils';

server.route.post('/api/openingOrClosingGiftDetailsForEvent', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            type: Joi.string().required()
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});


server.route.post('/api/openingGiftForEvent', {
    tags: ['api'],
    validate: {
        payload: {
            addressId: Joi.string().optional().allow(''),
            storeSelected: Joi.boolean(),
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            type: Joi.string().required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});