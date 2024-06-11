import 'babel-polyfill'
import axios from 'axios'
import API_MAP from '../../endpoints'
import config from 'config/appconfig'

export const EVENTDETAIL_SUCCESS = 'eventdetails/EVENTDETAIL_SUCCESS'
export const EVENTDETAIL_FAIL = 'eventdetails/EVENTDETAIL_FAIL'
export const EVENTDETAIL = 'eventdetails/EVENTDETAIL'

export function handleUpdatedCelebrityInfo(values) {
  return async (dispatch) => {
    dispatch({ type: 'CELEBRITY_INFO_DATA' })
    dispatch({ type: 'CELEBRITY_INFO_DATA_SUCCESS', payload: [...values] })
  }
}

export function handleUpdatedCelebrityInfos(values) {
  return async (dispatch) => {
    dispatch({ type: 'CELEBRITY_INFOS_DATA' })
    dispatch({ type: 'CELEBRITY_INFOS_DATA_SUCCESS', payload: [...values] })
  }
}

export function handleDeletedCelebrityInfo(values) {
  return async (dispatch) => {
    dispatch({ type: 'DELETED_CELEBRITY_INFO_DATA' })
    dispatch({ type: 'DELETED_CELEBRITY_INFO_DATA_SUCCESS', payload: [...values] })
  }
}

export function updateEventAddresses(values) {
  return async (dispatch) => {
    dispatch({ type: 'UPDATE_EVENT_ADDRESS' })
    dispatch({ type: 'UPDATE_EVENT_ADDRESS_SUCCESS', payload: [...values] })
  }
}

export function deletedAddressInfo(values) {
  return async (dispatch) => {
    dispatch({ type: 'DELETED_EVENT_ADDRESS' })
    dispatch({ type: 'DELETED_EVENT_ADDRESS_SUCCESS', payload: [...values] })
  }
}

export function updatePlasticCards(values) {
  return async (dispatch) => {
    dispatch({ type: 'UPDATE_PLASTIC_CARDS' })
    dispatch({ type: 'UPDATE_PLASTIC_CARDS_SUCCESS', payload: [...values] })
  }
}

export function deletePlasticCards(values) {
  return async (dispatch) => {
    dispatch({ type: 'DELETED_PLASTIC_CARDS' })
    dispatch({ type: 'DELETED_PLASTIC_CARDS_SUCCESS', payload: [...values] })
  }
}

export function addCoOwner(values) {
  return async (dispatch) => {
    dispatch({ type: 'ADD_COOWNER' })
    dispatch({ type: 'ADD_COOWNER_SUCCESS', payload: [...values] })
  }
}

export function updateAddCoOwner(values) {
  return async (dispatch) => {
    dispatch({ type: 'UPDATE_ADD_COOWNER' })
    dispatch({ type: 'UPDATE_ADD_COOWNER_SUCCESS', payload: [...values] })
  }
}

export function validateRequiredOwner(selectedEventCategory, selectedEventType, existingEventId, email) {

  const Channel = 'INSTORE'
  const Brand = 'LP'
  return {
    types: ['VALIDATE_REQUIRED_OWNER', 'VALIDATE_REQUIRED_OWNER_SUCCESS', 'VALIDATE_REQUIRED_OWNER_FAILURE'],
    ping: client => client.post(API_MAP.validate_Required_Owner, {
      data: {
        selectedEventCategory,
        email,
        selectedEventType,
        existingEventId,
      },
    }),
  }
}

export function isCoOwnerEligible(emails, eventType, eventId) {
  if (emails.length === 1) {
    return {
      types: ['VALIDATE_COOWNER_ELIGIBILITY', 'VALIDATE_COOWNER_ELIGIBILITY_SUCCESS', 'VALIDATE_COOWNER_ELIGIBILITY_FAILURE'],
      ping: client => client.post(API_MAP.coOwner_eligible, {
        data: {
          emailId: emails[0],
          eventType,
          eventId,
        },
      }),
    }
  }
  return [{
    types: ['VALIDATE_COOWNER_ELIGIBILITY', 'VALIDATE_COOWNER_ELIGIBILITY_SUCCESS', 'VALIDATE_COOWNER_ELIGIBILITY_FAILURE'],
    ping: client => client.post(API_MAP.coOwner_eligible, {
      data: {
        emailId: emails[0],
        eventType,
        eventId,
      },
    }),
  }, {
    types: ['VALIDATE_COOWNER2_ELIGIBILITY', 'VALIDATE_COOWNER2_ELIGIBILITY_SUCCESS', 'VALIDATE_COOWNER2_ELIGIBILITY_FAILURE'],
    ping: client => client.post(API_MAP.coOwner_eligible, {
      data: {
        emailId: emails[1],
        eventType,
        eventId,
      },
    }),
  }]

}

export function flushChangeOfEventData() {
  return async (dispatch) => {
    dispatch({ type: 'FLUSH_CHANGEOFEVENT_DATA' })
  }
}

export function flushPlasticCardData() {
  return async (dispatch) => {
    dispatch({ type: 'FLUSH_PLASTICCARD_DATA' })
  }
}
// export function isCoOwner2Eligible(emailId, eventType, eventId) {
//     return {
//         types: ['VALIDATE_COOWNER2_ELIGIBILITY', 'VALIDATE_COOWNER2_ELIGIBILITY_SUCCESS', 'VALIDATE_COOWNER2_ELIGIBILITY_FAILURE'],
//         ping: client => client.post(API_MAP.coOwner_eligible, {
//             data: {
//                 emailId,
//                 eventType,
//                 eventId
//             },
//         }),
//     }
// }

export function updateEventType(data) {
  const queryString = {
    eventId: data.existingEventId,
    profileId: '12345678',
  }
  return [{
    types: ['UPDATE_EVENT_TYPE', 'UPDATE_EVENT_TYPE_SUCCESS', 'UPDATE_EVENT_TYPE_FAILURE'],
    ping: client => client.post(API_MAP.update_Event_Type, {
      data,
    }),
  }, {
    types: [EVENTDETAIL, EVENTDETAIL_SUCCESS, EVENTDETAIL_FAIL],
    ping: client => client.post(API_MAP.get_details, {
      data: { ...queryString },
    }),
  }]
}
