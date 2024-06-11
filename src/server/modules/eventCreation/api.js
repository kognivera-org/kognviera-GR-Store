import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints'
import { server, models } from 'hails'
import appconfig from '../../../config/appconfig'
import serverUtils from '../../utils/serverUtils'

const { User } = models

server.route.post('/api/getEventCategories', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().required(),
      brand: Joi.string().required(),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
  })
})

server.route.post('/api/categorySpecificEvents', {
  tags: ['api'],
  validate: {
    payload: {
      categoryType: Joi.string().required(),
      channel: Joi.string().required(),
      brand: Joi.string().required(),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
    cacheKey: request.payload.categoryType,
  })

})

server.route.post('/api/addressSearch', {
  tags: ['api'],
  validate: {
    payload: {
      action: Joi.string().required(),
      cp: Joi.string().allow(''),
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      idEstado: Joi.string().allow(''),
      idMunicipio: Joi.string().allow(''),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
  })
})

server.route.post('/api/isProfileVerified', {
  tags: ['api'],
  validate: {
    payload: {
      email: Joi.string().required(),
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      eventType: Joi.string().allow(''),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest([
    {
      request,
      reply,
      transformRequest: (requestObj) => {
        delete requestObj.payload.eventType
        return requestObj
      },
    },
    {
      request,
      reply,
      transformRequest: (requestObj, requestPayload) => {
        delete requestObj.path
        requestObj.path = '/api/coOwnerEligible'
        requestObj.payload.emailId = requestPayload.email
        requestObj.payload.eventType = requestPayload.eventType
        delete requestObj.payload.email
        return requestObj
      },
    }])
})

server.route.post('/api/validateEventName', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      eventName: Joi.string().required(),
      eventDate: Joi.string().required(),
      ownerEmail: Joi.string().required(),
      coOwnerEmail: Joi.string().allow(''),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
    transformRequest: (requestObj) => {
      delete requestObj.payload.eventDate
      return requestObj
    },
    transformResponse: (responseObj, requestObj) => ({
      ...responseObj,
      ...requestObj,
    }),
  },
  )
})

server.route.post('/api/coOwnerEligible', {
  tags: ['api'],
  validate: {
    payload: {
      emailId: Joi.string().required(),
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      eventType: Joi.string().required(),
      eventId: Joi.string().allow(''),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
  })

})

server.route.post('/api/createProfile', {
  tags: ['api'],
  validate: {
    payload: {
      email: Joi.string().allow(''),
      password: Joi.string().allow(''),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      maternalName: Joi.string().allow(''),
      bdayDAY: Joi.string().allow(''),
      bdayMONTH: Joi.string().allow(''),
      bdayYEAR: Joi.string().allow(''),
      alias: Joi.string().allow(''),
      gender: Joi.string().allow(''),
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      ownerTitle: Joi.string().allow(''),
      ownerLabel: Joi.string().allow(''),
      autoLoginCheckbox: Joi.boolean().required(),
      isMinor: Joi.boolean().allow(''),
      celphone: Joi.string().allow(''),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
    transformRequest: (requestObj) => {
      delete requestObj.payload.celphone
      return requestObj
    },
    transformResponse: (responseObj, requestObj) => ({
      ...responseObj,
      ownerLabel: requestObj.ownerLabel,
      celphone: requestObj.celphone,
      ownerTitle: requestObj.ownerTitle,
      alias: requestObj.alias,
    }),
  })
})

server.route.post('/api/createEvent', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      eventType: Joi.string().required(),
      eventCategory: Joi.string().required(),
      preferredStoreId: Joi.string().allow(''),
      eventDate: Joi.string().required(),
      eventName: Joi.string().required(),
      imageURL: Joi.string(),
      isEmployee: Joi.string(),
      celebrityInfo: Joi.array().items({
        title: Joi.string().allow(''),
        ownerLabel: Joi.string().required(),
        profileId: Joi.string().allow(''), // It is optional as coowner is optional and we would always have the profileId of Owner
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        motherName: Joi.string().allow(''),
        nickName: Joi.string().allow(''),
        dateOfBirth: Joi.string().allow(''),
        phone: Joi.string().allow(''),
        isMinor: Joi.string().allow(''),
        email: Joi.string().allow(''),
        is_coowner: Joi.string().required(),
        sex: Joi.string().allow(''),
      }),
      addressesInfo: Joi.array().items({
        celebrityName: Joi.string().allow(''),
        nickname: Joi.string().required(),
        firstName: Joi.string().required(),
        middleName: Joi.string().allow(''),
        lastName: Joi.string().required(),
        maternalName: Joi.string().allow(''),
        country: Joi.string(),
        postalCode: Joi.string().required(),
        stateId: Joi.string().optional().allow(''),
        state: Joi.string().required(),
        city: Joi.string().required(),
        delegationMunicipality: Joi.string().required(),
        delegationMunicipalityId: Joi.string().allow(''),
        otherColony: Joi.string().allow(''),
        neighbourhood: Joi.string().required(),
        neighbourhoodId: Joi.string().allow(''),
        building: Joi.string().allow(''),
        exteriorNumber: Joi.string().required(),
        interiorNumber: Joi.string().allow(''),
        address1: Joi.string().required(),
        address2: Joi.string().allow(''),
        address3: Joi.string().allow(''),
        particularPhoneCode: Joi.string().allow(''),
        phoneNumber: Joi.string().required(),
        saveDays: Joi.array().allow(''),
        businessPhoneCode: Joi.string().allow(''),
        businessPhoneNumber: Joi.string().allow(''),
        cellular: Joi.string().allow(''),
        ecommAddressId: Joi.string().required(),
        landmark: Joi.string().allow(''),
      }),
      dilisiaCardInfo: Joi.array().items({
        cardNumber: Joi.string().required(),
        firstName: Joi.string().required(),
        middleName: Joi.string().allow(''),
        lastName: Joi.string().required(),
        motherLastName: Joi.string().allow(''),
        cardType: Joi.string().required(),
      }),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
  })
})


server.route.post('/api/createEventAddAddress', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      profileId: Joi.string().required(),
      nickname: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      landmark: Joi.string().allow(''),
      city: Joi.string().required(),
      state: Joi.string().required(),
      delegationMunicipality: Joi.string().required(),
      building: Joi.string().allow(''),
      otherColony: Joi.string().allow(''),
      postalCode: Joi.string().required(),
      neighbourhood: Joi.string().required(),
      exteriorNumber: Joi.string().required(),
      interiorNumber: Joi.string().allow(''),
      particularPhoneCode: Joi.string().allow(''),
      phoneNumber: Joi.string().required(),
      stateId: Joi.string().required(),
      cellular: Joi.string().allow(''),
      delegationMunicipalityId: Joi.string().allow(''),
      neighbourhoodId: Joi.string().allow(''),
      businessPhoneCode: Joi.string().allow(''),
      businessPhoneNumber: Joi.string().allow(''),
      address1: Joi.string().required(),
      address2: Joi.string().allow(''),
      address3: Joi.string().allow(''),
      maternalName: Joi.string().allow(''),
      middleName: Joi.string().allow(''),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
    transformRequest: (requestObj) => {
      delete requestObj.payload.landmark
      if (requestObj.payload.state === appconfig.states.Cdmx) {
        requestObj.payload.state = appconfig.states.Distrito_Federal
      }
      return requestObj
    },
    transformResponse: (responseObj, requestObj) => ({
      ...responseObj,
      landmark: requestObj.landmark,
    }),
  })

})

server.route.post('/api/createEventUpdateAddress', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().required(),
      brand: Joi.string().required(),
      profileId: Joi.string().required(),
      nickname: Joi.string().required(),
      newNickname: Joi.string().optional(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      delegationMunicipality: Joi.string().required(),
      building: Joi.string().allow(''),
      otherColony: Joi.string().allow(''),
      postalCode: Joi.string().required(),
      neighbourhood: Joi.string().required(),
      exteriorNumber: Joi.string().required(),
      interiorNumber: Joi.string().allow(''),
      landmark: Joi.string().allow(''),
      particularPhoneCode: Joi.string().allow(''),
      phoneNumber: Joi.string().required(),
      stateId: Joi.string().required(),
      cellular: Joi.string().allow(''),
      delegationMunicipalityId: Joi.string().allow(''),
      neighbourhoodId: Joi.string().allow(''),
      businessPhoneCode: Joi.string().allow(''),
      businessPhoneNumber: Joi.string().allow(''),
      address1: Joi.string().required(),
      address2: Joi.string().allow(''),
      address3: Joi.string().allow(''),
      maternalName: Joi.string().allow(''),
      middleName: Joi.string().allow(''),
      addressId: Joi.string().required(),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
    transformRequest: (requestObj) => {
      delete requestObj.payload.landmark
      if (requestObj.payload.state === appconfig.states.Cdmx) {
        requestObj.payload.state = appconfig.states.Distrito_Federal
      }
      return requestObj
    },
    transformResponse: (responseObj, requestObj) => ({
      ...responseObj,
      landmark: requestObj.landmark,
    }),
  })

})


server.route.post('/api/getDeliveryAddressesForInstore', {
  tags: ['api'],
  validate: {
    payload: {
      profileId: Joi.string().required(),
      channel: Joi.string().required(),
      brand: Joi.string().required(),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
  })

})

server.route.post('/api/saveOwnerDetails', {
  tags: ['api'],
  validate: {
    payload: {
      ownerId: Joi.string().required(),
      ownerEmail: Joi.string().required(),
      ownerTitle: Joi.string().required(),
      ownerfirstName: Joi.string().required(),
      ownerlastName: Joi.string().required(),
      ownerMotherName: Joi.string().required(),
      ownerDateofbirth: Joi.string().required(),
      ownerPhone: Joi.string().required(),
      ownerHasPermission: Joi.string().required(),
      channel: Joi.string().required(),
      brand: Joi.string().required(),
    },
  },
}, (request, reply) => {
  serverUtils.triggerServerRequest({
    request,
    reply,
  })

})

server.route.post('/api/addAndUpdateDilisaCard', {
  tags: ['api'],
  validate: {
    payload: {
      channel: Joi.string().allow(''),
      brand: Joi.string().allow(''),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      cardNumber: Joi.string().required(),
      // cardType: Joi.string().required(),
      middleName: Joi.string().allow(''),
      motherLastName: Joi.string().allow(''),
    },
  },
}, (request, reply) => {

  const cardNumber = request.payload.cardNumber
  let isValidCard = false
  const employeeCardBinRanges = appconfig.employeeCardBinRanges
  employeeCardBinRanges && employeeCardBinRanges.length > 0 && employeeCardBinRanges.map((binValue, index) => {
    if (cardNumber && cardNumber.startsWith(binValue)) {
      isValidCard = true
    }
  })
  if (!isValidCard) {
    const error = { status: { errorMessage: 'Los datos de la tarjeta ingresada no pertenecen a un empleado', errorCode: '', status: 'failure' } }
    reply(error)
  } else {
    reply(request.payload)
  }
})

server.route.post('/api/displayDilisaCard', {
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
