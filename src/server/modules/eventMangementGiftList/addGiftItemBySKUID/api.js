import Joi from 'joi';
import Boom from 'boom';
import axios from 'axios';
import { server, models } from 'hails';
import serverEndpoints from 'server/serverEndpoints';
import serverUtils from '../../../utils/serverUtils';

const { User } = models;

server.route.post('/api/eventGiftList/addGiftItemBySKUID', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().min(1).required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            skuId: Joi.string().required(),
            quantity: Joi.string().required(),
            deliveryMode: Joi.string().required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});
