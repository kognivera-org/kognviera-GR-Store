import Joi from 'joi'
// import Boom from 'boom';
import axios from 'axios'
import 'babel-polyfill'
// import { server } from 'hails'
import serverEndpoints from 'server/serverEndpoints'
import serverUtils from '../../../utils/serverUtils'
import appconfig from '../../../../config/appconfig'
// import { server, models } from 'hails';

module.exports = function () {
  return [
    {
      method: 'POST',
      path: '/api/EditAddressGR',
      handler: async (request, reply) => {
        serverUtils.triggerServerRequest({
          request,
          reply,
          transformRequest: (requestObj) => {
            if (requestObj.payload.state === appconfig.states.Cdmx) {
              requestObj.payload.state = appconfig.states.Distrito_Federal
            }
            if (requestObj.payload.newNickname) {
              requestObj.payload.nickname = requestObj.payload.newNickname;
              delete requestObj.payload.newNickname;
            }
            return requestObj
          },
        })
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            profileId: Joi.string().allow(''),
            eventId: Joi.string().required(),
            addressId: Joi.string().required(),
            nickname: Joi.string().required(),
            newNickname: Joi.string().optional(),
            celebrityName: Joi.string().required(),
            ownerId: Joi.string().optional().allow(''),
            firstName: Joi.string().required(),
            middleName: Joi.string().optional().allow(''),
            maternalName: Joi.string().optional().allow(''),
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
            cellular: Joi.string().optional().allow(''),
            otherColony: Joi.string().optional().allow(''),
            landmark: Joi.string().optional().allow(''),
          }),
        }
      }
    },
  ]
}
