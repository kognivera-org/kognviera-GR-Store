import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
import { server, models } from 'hails'
import Datetime from 'lib/datetime/DateTime';
import serverUtils from '../../utils/serverUtils';
import log from '../../utils/logUtils';

const { User } = models

server.route.post('/api/login', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
    },
  },
},
  async (request, reply) => {
    try {
      log.debug('xx-login-request :: ', request.payload);
      const response = await axios.post(serverEndpoints['/api/login'], {
        emailId: request.payload.username,
        password: request.payload.password
      })
      const retObj = { ...response.data, emailId: request.payload.username }
      log.debug('xx-login-response :: ', response);
      response.data.status &&
        response.data.status.status &&
        response.data.status.status.toLowerCase() == 'failure' ?
        reply(retObj) :
        reply(retObj).header('set-cookie', response.headers['set-cookie'])
    } catch (error) {
      log.error('xx-login-error :: ', error);
      reply(error)
    }
  });

server.route.post('/api/logout', {
  tags: ['api'],
  validate: {
    payload: {
      storeAssociateId: Joi.string().required(),
      channel: Joi.string().required(),
      brand: Joi.string().required(),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
  });
});

server.route.post('/api/updatepassword', {
  tags: ['api'],
  validate: {
    payload: {
      currentPassword: Joi.string().allow(''),
      newPassword: Joi.string().required(),
      confirmPassword: Joi.string().required(),
      storeAssociateId: Joi.string(),
      userName: Joi.string().allow(''),
      requestType: Joi.string(),
      channel: Joi.string().required(),
      brand: Joi.string().required(),
    },
  },
}, (request, reply) => {
  if (request.payload.newPassword != request.payload.confirmPassword) {
    reply(Boom.badData("new password doesn't match with confirm password."));
    return;
  }
  delete request.payload.confirmPassword;
  log.debug("UPDATEPASSWORDREQUEST:::", request)
  serverUtils.triggerServerRequest({
    request,
    reply,
  });
})

server.route.post('/api/saveStoreDetails', {
  tags: ['api'],
  validate: {
    payload: {
      storeId: Joi.string().required(),
      channel: Joi.string().required(),
      brand: Joi.string().required(),
    }
  }
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
    transformResponse: (response, requestObj) => {
      response.storeId = requestObj.storeId;
      return response
    }
  });
});