import Joi from 'joi'
// import Boom from 'boom';
import axios from 'axios'
import 'babel-polyfill'
import { server } from 'hails'
import serverEndpoints from 'server/serverEndpoints'
import appconfig from '../../../../config/appconfig'
import serverUtils from '../../../utils/serverUtils'
// import { server, models } from 'hails';

server.route.post('/api/getAdressSearch', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      eventId: Joi.string().required(),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
  })
})

server.route.post('/api/addAddressGR', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      profileId: Joi.string().allow(''),
      ecommAddressId: Joi.string().allow(''),
      eventId: Joi.string().required(),
      nickname: Joi.string().required(),
      celebrityName: Joi.string().required(),
      firstName: Joi.string().required(),
      middleName: Joi.string().optional().allow(''),
      materalName: Joi.string().optional().allow(''),
      lastName: Joi.string().required(),
      country: Joi.string().required(),
      city: Joi.string().required(),
      stateId: Joi.string().required(),
      state: Joi.string().required(),
      delegationMunicipality: Joi.string().required(),
      delegationMunicipalityId: Joi.string().allow(''),
      building: Joi.string().optional().allow(''),
      postalCode: Joi.string().required(),
      neighbourhood: Joi.string().required(),
      neighbourhoodId: Joi.string().allow(''),
      address1: Joi.string().required(),
      address2: Joi.string().optional().allow(''),
      address3: Joi.string().optional().allow(''),
      exteriorNumber: Joi.string().required(),
      interiorNumber: Joi.string().optional().allow(''),
      particularPhoneCode: Joi.string().allow(''),
      phoneNumber: Joi.string().required(),
      businessPhoneCode: Joi.number().optional().allow(''),
      businessPhoneNumber: Joi.number().optional().allow(''),
      cellular: Joi.number().optional().allow(''),
      otherColony: Joi.string().optional().allow(''),
      landmark: Joi.string().optional().allow(''),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
    transformRequest: (requestObj) => {
      if (requestObj.payload.state === appconfig.states.Cdmx) {
        requestObj.payload.state = appconfig.states.Distrito_Federal
      }
      return requestObj
    },
  })
})
