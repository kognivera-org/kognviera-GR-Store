import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import { server, models } from 'hails'
import serverEndpoints from 'server/serverEndpoints';
import serverUtils from '../../../utils/serverUtils';
const { User } = models

server.route.post('/api/eventGiftList/getRegalosRegistrados', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            searchKeyword: Joi.string().allow(''),
            priceOrder: Joi.string().allow(''),
            currentPage: Joi.number().allow(''),
            priceOrderCategory: Joi.string().allow(''),
            isShowAll: Joi.string().allow(''),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});

server.route.post('/api/eventGiftList/removeItemsFromGiftlist', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            giftItemIds: Joi.array().items(Joi.string()).required(),
            currentPage: Joi.number().allow('')
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});

server.route.post('/api/eventGiftList/saveQuantity', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            giftItemId: Joi.string().required(),
            skuId: Joi.string().required(),
            quantity: Joi.number().required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});

server.route.post('/api/eventGiftList/setFavouriteGift', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            giftItemId: Joi.string().required(),
            skuId: Joi.string().required(),
            isFavourite: Joi.string().required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});

server.route.post('/api/eventGiftlist/changeDeliveryMode', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            modeOfDelivery: Joi.string().required(),
            giftItemIds: Joi.array().items(Joi.string()).required(),
            currentPage: Joi.number().allow('')
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});

server.route.post('/api/eventGiftlist/changeDeliveryAddress', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            addressId: Joi.string().min(1).required(),
            giftItemIds: Joi.array().items(Joi.string()).required(),
            currentPage: Joi.number().allow('')
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});
