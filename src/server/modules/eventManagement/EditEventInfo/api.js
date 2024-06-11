import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
import { server, models } from 'hails'
import 'babel-polyfill'
import serverUtils from '../../../utils/serverUtils';

server.route.post('/api/saveEditEventInfo', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            ownerId: Joi.string().required(),
            ownerTitle: Joi.string().required(),
            ownerfirstName: Joi.string().required(),
            ownerlastName: Joi.string().required(),
            ownerMotherName: Joi.string().allow(''),
            ownerDateofbirth: Joi.string().allow(''),
            nickName: Joi.string().allow(''),
            ownerPhone: Joi.string().allow(''),
            ownerHasPermission: Joi.boolean(),
            ownerEmail: Joi.string().allow(''),
            profileId: Joi.string().allow(''),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
        transformRequest: requestObj => {
            requestObj.payload.ownerEmail = requestObj.payload.ownerEmail && requestObj.payload.ownerEmail.toLowerCase()
            return requestObj;
        },
    });
});

server.route.post('/api/addEventInfo', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            title: Joi.string().required(),
            celebfirstName: Joi.string().required(),
            celeblastName: Joi.string().required(),
            celebmotherName: Joi.string().allow(''),
            celebnickName: Joi.string().allow(''),
            celebdateofbirth: Joi.string().allow(''),
            celebphone: Joi.string().allow(''),
            ownerHasPermission: Joi.boolean(),
            ownerEmail: Joi.string().allow(''),
            ownerLabel: Joi.string().allow(''),
            profileId: Joi.string().allow(''),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
        transformRequest: requestObj => {
            requestObj.payload.ownerEmail = requestObj.payload.ownerEmail && requestObj.payload.ownerEmail.toLowerCase()
            return requestObj;
        },
    });
});

server.route.post('/api/setEventDate', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            selectedEventDate: Joi.string().required()
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });

});