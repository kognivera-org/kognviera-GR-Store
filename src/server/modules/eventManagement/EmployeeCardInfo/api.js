import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
import { server, models } from 'hails'
const { User } = models
import appconfig from '../../../../config/appconfig'
import serverUtils from '../../../utils/serverUtils';

server.route.post('/api/addAndUpdateEmployeeCard', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            cardNumber: Joi.string().required(),
            middleName: Joi.string().allow(''),
            motherLastName: Joi.string().allow(''),
            cardId: Joi.string().allow('')
        },
    },
}, (request, reply) => {
    const cardNumber = request.payload.cardNumber;
    let isValidCard = false;
    const employeeCardBinRanges = appconfig.employeeCardBinRanges;
    employeeCardBinRanges && employeeCardBinRanges.length > 0 && employeeCardBinRanges.map(function (binValue, index) {
        if (cardNumber && !cardNumber.startsWith(binValue)) {
            isValidCard = true;
        }
    })
    if (!isValidCard) {
        const error = { status: { errorMessage: 'Los datos de la tarjeta ingresada no pertenecen a un empleado', errorCode: '', status: 'failure' } }
        reply(error)
    } else {
        serverUtils.triggerServerRequest({
            request,
            reply,
        });
    }
})


server.route.post('/api/removeDilisaCard', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            cardNumber: Joi.string().required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });


})