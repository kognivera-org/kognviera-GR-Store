import Joi from 'joi';
// import Boom from 'boom';
import axios from 'axios';
import 'babel-polyfill';
import { server } from 'hails';
import serverEndpoints from 'server/serverEndpoints';
// import { server, models } from 'hails';
import serverUtils from '../../../utils/serverUtils';

server.route.post('/api/fetchPlasticCards', {
  tags: ['api'],

}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
  });
});
server.route.post('/api/deletePlasticCards', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      eventId: Joi.string().required(),
      ownerId: Joi.string().required(),
      plasticCardNumber: Joi.string().required(),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
  });
});


server.route.post('/api/addPlasticCard', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      eventId: Joi.string().required(),
      ownerId: Joi.string().required(),
      plasticCardNumber: Joi.string().required(),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
  });
});
