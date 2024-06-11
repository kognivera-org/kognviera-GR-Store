import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
import { server, models } from 'hails'
import Datetime from 'lib/datetime/DateTime';
import serverUtils from '../../utils/serverUtils';

server.route.post('/api/getStateList', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            searchType: Joi.string().required(),
        },
    },
}, (request, reply) => {
    //request.payload.brand = 'LP';
    //request.payload.channel = 'web';
    serverUtils.triggerServerRequest({
        request,
        reply,
        cacheKey: request.payload.searchType
    });
});

server.route.post('/api/getStoreList', {
    tags: ['api'],
    validate: {
        payload: {
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            stateId: Joi.string().required(),
            searchType: Joi.string().required(),
        },
    },
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
        cacheKey: request.payload.searchType + '_' + request.payload.stateId
    });

});