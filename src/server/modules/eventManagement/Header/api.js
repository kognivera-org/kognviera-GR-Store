import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
import { server, models } from 'hails'
import 'babel-polyfill'
import serverUtils from '../../../utils/serverUtils';

server.route.post('/api/displayEventStatusDropdown', {
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

server.route.post('/api/changeEmployeeEvent', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            employeeEventFlag: Joi.string().required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});

server.route.post('/api/changeEventStatus', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            selectedEventStatus: Joi.string().required(),
            isSuspendedForPeriod: Joi.string().required(),
            newEventDate: Joi.string().allow(),
            suspensionInfo: Joi.object().allow().keys({
                eventDate: Joi.string().required(),
                range: Joi.object().allow().keys({
                    startDate: [Joi.string().allow('')],
                    endDate: [Joi.string().allow('')],
                })
            })
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});

server.route.post('/api/setOwnerDetailsInSession', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            isConsultant: Joi.boolean().required(),
            ownerId: [Joi.string().allow('')],
            profileId: [Joi.string().allow('')],
            eventId: [Joi.string().allow('')]
        }
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});