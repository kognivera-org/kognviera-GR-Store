
import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
import { server, models } from 'hails'
import 'babel-polyfill';
import serverUtils from '../../../utils/serverUtils';

server.route.post('/api/getRegaloRecibidos', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().min(1).required(),
            brand: Joi.string().min(1).required(),
            eventId: Joi.string().min(1).required(),
            filteringParameters: Joi.array().items(Joi.object()),
            priceOrder: Joi.string().optional().allow(''),
            searchKeyword: Joi.string().optional().allow(''),
            currentPage: Joi.number().allow(''),
            isShowAll: Joi.string().optional().allow(''),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});
server.route.post('/api/getPurchaseTicketDetails', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().min(1).required(),
            brand: Joi.string().min(1).required(),
            eventId: Joi.string().min(1).required(),
            boletaNumber: Joi.string().min(1).required(),
            tiendaNumber: Joi.string().min(1).required(),
            terminalNumber: Joi.string().min(1).required(),
            authCode: Joi.string().min(1).required(),
            actionType: Joi.string().min(1).required(),
            purchasedDate: Joi.string().optional().allow(''),
            skuId: Joi.string().optional().allow(''),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});
server.route.post('/api/getTrackOrder', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().min(1).required(),
            brand: Joi.string().min(1).required(),
            eventId: Joi.string().min(1).required(),
            pedidoNo: Joi.string().min(1).required(),
            itemId: Joi.string().optional().allow(''),

        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});
server.route.post('/api/associatePurchaseTicket', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().min(1).required(),
            brand: Joi.string().min(1).required(),
            eventId: Joi.string().min(1).required(),
            boletaNumber: Joi.string().min(1).required(),
            empresaId: Joi.string().min(1).required(),
            purchaseDate: Joi.string().min(1).required(),
            purchaserName: Joi.string().optional().allow(''),
            terminalNumber: Joi.string().min(1).required(),
            tiendaNumber: Joi.string().min(1).required(),
            personalPurchase: Joi.string().min(1).required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});
server.route.post('/api/dissociatePurchaseTicket', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().min(1).required(),
            brand: Joi.string().min(1).required(),
            eventId: Joi.string().min(1).required(),
            boletaNumber: Joi.string().min(1).required(),
            empresaId: Joi.string().min(1).required(),
            purchaseDate: Joi.string().min(1).required(),
            purchaserName: Joi.string().optional().allow(''),
            terminalNumber: Joi.string().min(1).required(),
            tiendaNumber: Joi.string().min(1).required(),
            personalPurchase: Joi.string().min(1).required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});
server.route.post('/api/disassociatePurchasedTicketByButton', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().min(1).required(),
            brand: Joi.string().min(1).required(),
            eventId: Joi.string().min(1).required(),
            purchaseTicketId: Joi.string().min(1).required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});

server.route.post('/api/getMessages', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().min(1).required(),
            brand: Joi.string().min(1).required(),
            eventId: Joi.string().min(1).required(),
            itemId: Joi.string().min(1).required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});
server.route.post('/api/addMessage', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().min(1).required(),
            brand: Joi.string().min(1).required(),
            eventId: Joi.string().min(1).required(),
            itemId: Joi.string().min(1).required(),
            guestName: Joi.string().min(1).required(),
            emailId: Joi.string().optional().allow(''),
            message: Joi.string().optional().allow(''),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
        transformRequest: requestObj => {
            requestObj.payload.emailId = requestObj.payload.emailId && requestObj.payload.emailId.toLowerCase()
            return requestObj;
        },
    });
});
server.route.post('/api/deleteMessage', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().min(1).required(),
            brand: Joi.string().min(1).required(),
            eventId: Joi.string().min(1).required(),
            itemId: Joi.string().min(1).required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});
server.route.post('/api/savePurchaserName', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().min(1).required(),
            brand: Joi.string().min(1).required(),
            eventId: Joi.string().min(1).required(),
            purchaseTicketId: Joi.string().min(1).required(),
            purchaserName: Joi.string().min(1).required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});
server.route.post('/api/addAgainGiftItem', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().min(1).required(),
            brand: Joi.string().min(1).required(),
            eventId: Joi.string().min(1).required(),
            skuId: Joi.string().min(1).required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});


server.route.post('/api/getReceivedGiftsMessages', {
    tags: ['api'],

}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });

});