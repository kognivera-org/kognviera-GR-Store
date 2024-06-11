import Joi from 'joi';
// import Boom from 'boom';
import axios from 'axios';
import 'babel-polyfill';
import { server } from 'hails';
import serverEndpoints from 'server/serverEndpoints';
// import { server, models } from 'hails';
import serverUtils from '../../../utils/serverUtils';

server.route.post('/api/getEventDeliveryAddresses', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});

server.route.post('/api/deleteDeliveryAddresses', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            addressId: Joi.string().required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});

server.route.post('/api/assignAddress', {
    tags: ['api'],
    validate: {
        payload: {
            brand: Joi.string().required(),
            channel: Joi.string().required(),
            eventId: Joi.string().required(),
            addressId1: Joi.string().required(),
            celebrityId1: Joi.string().required(),
            addressId2: Joi.string().allow(''),
            celebrityId2: Joi.string().allow(''),
            addressId3: Joi.string().allow(''),
            celebrityId3: Joi.string().allow(''),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});


