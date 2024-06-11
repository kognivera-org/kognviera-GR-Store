import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
import { server, models } from 'hails'
import 'babel-polyfill'
import serverUtils from '../../utils/serverUtils';

server.route.post('/api/deliveryPreference', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            postalCode: Joi.array().required(),
            preferredDeliveryDayOpted: Joi.boolean()
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
    });
});


