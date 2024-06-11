import Joi from 'joi';
import axios from 'axios';
import 'babel-polyfill';
import { server } from 'hails';
import serverEndpoints from 'server/serverEndpoints';
import serverUtils from '../../../utils/serverUtils';

server.route.post('/api/checkEventForFraud', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
        },
    },
}, async (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});

server.route.post('/api/updateEventStatus', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            actionType: Joi.string().required()
        },
    },
}, async (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});