import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
import { server, models } from 'hails'
const { User } = models
import appconfig from '../../../config/appconfig'
import serverUtils from '../../utils/serverUtils';

// server.route.post('/api/validateRequiredOwners', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             selectedEventCategory: Joi.string().required(),
//             selectedEventType: Joi.string().required(),
//             existingEventId: Joi.string().required(),
//             channel: Joi.string().required(),
//             brand: Joi.string().required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });

// })

server.route.post('/api/validateRequiredOwners', {
    tags: ['api'],
    validate: {
        payload: {
            email: Joi.string().required(),
            selectedEventCategory: Joi.string().required(),
            selectedEventType: Joi.string().required(),
            existingEventId: Joi.string().required(),
            channel: Joi.string().required(),
            brand: Joi.string().required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest([
        {
            request,
            reply,
            transformRequest: (requestObj) => {
                delete requestObj.payload.email
                return requestObj;
            }
        },
        {
            request,
            reply,
            transformRequest: (requestObj, requestPayload) => {
                delete requestObj.path
                requestObj.path = '/api/coOwnerEligible'
                requestObj.payload.emailId = requestPayload.email
                requestObj.payload.eventType = requestPayload.selectedEventType
                requestObj.payload.eventId = requestPayload.existingEventId
                delete requestObj.payload.email
                delete requestObj.payload.selectedEventType
                delete requestObj.payload.existingEventId
                delete requestObj.payload.selectedEventCategory
                return requestObj;
            }
        }]);
})


// server.route.post('/api/validateRequiredOwners', {
//     tags: ['api'],
//     validate: {
//         payload: {
//             selectedEventCategory: Joi.string().required(),
//             selectedEventType: Joi.string().required(),
//             existingEventId: Joi.string().required(),
//             channel: Joi.string().required(),
//             brand: Joi.string().required(),
//         },
//     },
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//     });

// })

server.route.post('/api/updateEventType', {
    tags: ['api'],
    validate: {
        payload: {
            selectedEventCategory: Joi.string().required(),
            selectedEventType: Joi.string().required(),
            existingEventId: Joi.string().required(),
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            newEventName: Joi.string().required(),
            deletedInfo: Joi.object({
                deletedCoOwnerIds: Joi.array().allow(''),
                deletedAddressIds: Joi.array().allow(''),
                deletedPlasticCards: Joi.array().allow(''),
            }),
            addedInfo: Joi.object({
                addedOwners: Joi.array().items({
                    ownerLabel: Joi.string().allow(''),
                    title: Joi.string().allow(''),
                    firstName: Joi.string().allow(''),
                    lastName: Joi.string().allow(''),
                    motherName: Joi.string().allow(''),
                    nickname: Joi.string().allow(''),
                    dateOfBirth: Joi.string().allow(''),
                    phone: Joi.string().allow(''),
                    ownerEmail: Joi.string().allow(''),
                }),
                addressMapping: Joi.array().items({
                    addressId: Joi.string().required(),
                    celebrityId: Joi.string().allow(''),
                    celebrityName: Joi.string().required(),
                })
            }),
            updatedInfo: Joi.array().items({
                ownerId: Joi.string().required(),
                ownerLabel: Joi.string().required(),
                title: Joi.string().required(),
            })
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });

})
