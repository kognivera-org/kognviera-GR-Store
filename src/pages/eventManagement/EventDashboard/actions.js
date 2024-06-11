import 'babel-polyfill';
import API_MAP from '../../../endpoints';
import axios from 'axios';

export const EVENTDETAIL_SUCCESS = 'eventdetails/EVENTDETAIL_SUCCESS';
export const EVENTDETAIL_FAIL = 'eventdetails/EVENTDETAIL_FAIL';
export const EVENTDETAIL = 'eventdetails/EVENTDETAIL';
const GIFTANDPURCHASE_SUCCESS = 'eventdetails/GIFTANDPURCHASE_SUCCESS';
const GIFTANDPURCHASE_FAIL = 'eventdetails/GIFTANDPURCHASE_FAIL';
const GIFTANDPURCHASE = 'eventdetails/GIFTANDPURCHASE';
const EVENTACCOUNTSTATEMENT_SUCCESS = 'eventdetails/EVENTACCOUNTSTATEMENT_SUCCESS';
const EVENTACCOUNTSTATEMENT_FAIL = 'eventdetails/EVENTACCOUNTSTATEMENT_FAIL';
const EVENTACCOUNTSTATEMENT = 'eventdetails/EVENTACCOUNTSTATEMENT';
export const ACCOUNTTRANSFER_SUCCESS = 'eventdetails/ACCOUNTTRANSFER_SUCCESS';
export const ACCOUNTTRANSFER_FAIL = 'eventdetails/ACCOUNTTRANSFER_FAIL';
export const ACCOUNTTRANSFER = 'eventdetails/ACCOUNTTRANSFER';

export const GET_PLASTIC_CARD = 'GET_PLASTIC_CARD';
export const GET_PLASTIC_CARD_SUCCESS = 'GET_PLASTIC_CARD_SUCCESS';
export const GET_PLASTIC_CARD_FAIL = 'GET_PLASTIC_CARD_FAIL';

export const GET_CLOSING_GIFT_PRICE_RANGE = 'GET_CLOSING_GIFT_PRICE_RANGE';
export const CLOSING_GIFT_PRICE_RANGE_SUCCESSFULL = 'CLOSING_GIFT_PRICE_RANGE_SUCCESSFULL';
export const CLOSING_GIFT_PRICE_RANGE_FAIL = 'CLOSING_GIFT_PRICE_RANGE_FAIL';

export const DELETE_PLASTIC_CARD = 'DELETE_PLASTIC_CARD';
export const DELETE_PLASTIC_CARD_SUCCESS = 'DELETE_PLASTIC_CARD_SUCCESS';
export const DELETE_PLASTIC_CARD_FAIL = 'DELETE_PLASTIC_CARD_FAIL';

export const ADD_PLASTIC_CARD = 'ADD_PLASTIC_CARD';
export const ADD_PLASTIC_CARD_SUCCESS = 'ADD_PLASTIC_CARD_SUCCESS';
export const ADD_PLASTIC_CARD_FAIL = 'ADD_PLASTIC_CARD_FAIL';
export const CLEAR_PLATIC_CARD_SERVER_ERROR = 'CLEAR_PLATIC_CARD_SERVER_ERROR';

export const GET_NOTES = 'GET_NOTES';
export const GET_NOTES_SUCCESSFULL = 'GET_NOTES_SUCCESSFULL';
export const GET_NOTES_FAIL = 'GET_NOTES_FAIL';

export const CREATE_NEW_NOTE = 'CREATE_NEW_NOTE';
export const CREATE_NEW_NOTE_SUCCESSFULL = 'CREATE_NEW_NOTE_SUCCESSFULL';
export const CREATE_NEW_NOTE_FAIL = 'CREATE_NEW_NOTE_FAIL';

export const DELETE_NOTE = 'DELETE_NOTE';
export const DELETE_NOTE_SUCCESSFULL = 'DELETE_NOTE_SUCCESSFULL';
export const DELETE_NOTE_FAIL = 'DELETE_NOTE_FAIL';

export const GET_FAILED_TRANSACTION = 'GET_FAILED_TRANSACTION';
export const GET_FAILED_TRANSACTION_SUCCESS = 'GET_FAILED_TRANSACTION_SUCCESS';
export const GET_FAILED_TRANSACTION_FAILURE = 'GET_FAILED_TRANSACTION_FAILURE';

export const GET_OPENING_OR_CLOSING_GIFT_DETAILS = 'GET_OPENING_OR_CLOSING_GIFT_DETAILS';
export const GET_OPENING_OR_CLOSING_GIFT_DETAILS_SUCCESS = 'GET_OPENING_OR_CLOSING_GIFT_DETAILS_SUCCESS';
export const GET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE = 'GET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE';

export const SET_OPENING_OR_CLOSING_GIFT_DETAILS = 'SET_OPENING_OR_CLOSING_GIFT_DETAILS';
export const SET_OPENING_OR_CLOSING_GIFT_DETAILS_SUCCESS = 'SET_OPENING_OR_CLOSING_GIFT_DETAILS_SUCCESS';
export const SET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE = 'SET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE';

export const GETEVENTDELIVERYADDRESSES = 'GETEVENTDELIVERYADDRESSES';
export const GETEVENTDELIVERYADDRESSES_SUCCESS = 'GETEVENTDELIVERYADDRESSES_SUCCESS';
export const GETEVENTDELIVERYADDRESSES_FAILURE = 'GETEVENTDELIVERYADDRESSES_FAILURE';

export const CHECKEVENTFORFRAUD = 'CHECKEVENTFORFRAUD';
export const CHECKEVENTFORFRAUD_SUCCESS = 'CHECKEVENTFORFRAUD_SUCCESS';
export const CHECKEVENTFORFRAUD_FAILURE = 'CHECKEVENTFORFRAUD_FAILURE';

export const UPDATEEVENTSTATUS = 'UPDATEEVENTSTATUS';
export const UPDATEEVENTSTATUS_SUCCESS = 'UPDATEEVENTSTATUS_SUCCESS';
export const UPDATEEVENTSTATUS_FAILURE = 'UPDATEEVENTSTATUS_FAILURE';
export const RESET_SET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE_MESSAGE = 'RESET_SET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE_MESSAGE';

export function resetSetOpeningAndClosing() {
  return {
    type: RESET_SET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE_MESSAGE
  }
}
export function getFailedTransferences(eventId) {
  return {
    types: [GET_FAILED_TRANSACTION, GET_FAILED_TRANSACTION_SUCCESS, GET_FAILED_TRANSACTION_FAILURE],
    ping: client => client.post(API_MAP.get_failedTransaction, {
      data: {
        eventId: eventId
      }
    })
  }
}

export function getEventDeliveryAddressesForGiftOpening(eventId) {
  return {
    types: [GETEVENTDELIVERYADDRESSES, GETEVENTDELIVERYADDRESSES_SUCCESS, GETEVENTDELIVERYADDRESSES_FAILURE],
    ping: client => client.post(API_MAP.get_delivery_addresses_url, {
      data: {
        eventId: eventId
      }
    })
  }
}

export function setOpeningOrClosingGiftDetailsForEvent(eventId, addressId, storeSelected, type) {
  const query = {
    eventId,
    addressId,
    type,
    storeSelected
  }
  return [{
    types: [SET_OPENING_OR_CLOSING_GIFT_DETAILS, SET_OPENING_OR_CLOSING_GIFT_DETAILS_SUCCESS, SET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE],
    ping: client => client.post(API_MAP.set_openingGiftForEvent, {
      data: query
    })
  }, {
    types: [GET_OPENING_OR_CLOSING_GIFT_DETAILS, GET_OPENING_OR_CLOSING_GIFT_DETAILS_SUCCESS, GET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE],
    ping: client => client.post(API_MAP.get_openingOrClosingGiftDetailsForEvent, {
      data: {
        eventId,
        type
      },
    }),
  }]

}
export function clearErrorOfAddingNewPlasticCard() {
  return {
    type: CLEAR_PLATIC_CARD_SERVER_ERROR,
  }
}
export function getOpeningOrClosingGiftDetailsForEvent(eventId, type) {
  const queryString = {
    eventId: eventId,
    type
  }
  return {
    types: [GET_OPENING_OR_CLOSING_GIFT_DETAILS,
      GET_OPENING_OR_CLOSING_GIFT_DETAILS_SUCCESS,
      GET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE],
    ping: client => client.post(API_MAP.get_openingOrClosingGiftDetailsForEvent, {
      data: { ...queryString },
    }),
  };
}

export function createNote(queryString) {
  return [{
    types: [CREATE_NEW_NOTE, CREATE_NEW_NOTE_SUCCESSFULL, CREATE_NEW_NOTE_FAIL],
    ping: client => client.post('/api/createNotes', {
      data: {
        ...queryString
      }
    })
  }, {
    types: [GET_NOTES, GET_NOTES_SUCCESSFULL, GET_NOTES_FAIL],
    ping: client => client.post(API_MAP.get_Notes, {
      data: {
        eventId: queryString.eventId
      },
    }),
  }]
}
export function deleteNote(queryString) {
  return [{
    types: [DELETE_NOTE, DELETE_NOTE_SUCCESSFULL, DELETE_NOTE_FAIL],
    ping: client => client.post('/api/deleteNotes', {
      data: {
        ...queryString
      }
    })
  }, {
    types: [GET_NOTES, GET_NOTES_SUCCESSFULL, GET_NOTES_FAIL],
    ping: client => client.post(API_MAP.get_Notes, {
      data: {
        eventId: queryString.eventId
      },
    }),
  }]
}
export function getNotes(eventId) {
  const queryString = {};
  queryString.eventId = eventId;
  return {
    types: [GET_NOTES, GET_NOTES_SUCCESSFULL, GET_NOTES_FAIL],
    ping: client => client.post(API_MAP.get_Notes, {
      data: { ...queryString },
    }),
  };
}
export function executeEventDetail(eventId, profileId) {
  const queryString = {
    eventId: eventId,
    profileId: profileId
  }
  return {
    types: [EVENTDETAIL, EVENTDETAIL_SUCCESS, EVENTDETAIL_FAIL],
    ping: client => client.post(API_MAP.get_details, {
      data: { ...queryString },
    }),
  };
}

export function executeClosingGiftPriceRangeInfo(eventId) {
  const queryString = {
    eventId: eventId
  }

  return {
    types: [GET_CLOSING_GIFT_PRICE_RANGE, CLOSING_GIFT_PRICE_RANGE_SUCCESSFULL, CLOSING_GIFT_PRICE_RANGE_FAIL],
    ping: client => client.post(API_MAP.get_closingGiftPriceRange, {
      data: { ...queryString },
    }),
  };
}
export function executeGiftAndPurchaseData(eventId) {
  const queryString = {
    "eventId": eventId
  }
  return {
    types: [GIFTANDPURCHASE, GIFTANDPURCHASE_SUCCESS, GIFTANDPURCHASE_FAIL],
    ping: client => client.post(API_MAP.get_GiftsAndPurchases, {
      data: queryString,
    }),
  };
}
export function executeEventAccountStatementDetail(eventId) {
  const queryString = {
    "eventId": eventId
  }
  return {
    types: [EVENTACCOUNTSTATEMENT, EVENTACCOUNTSTATEMENT_SUCCESS, EVENTACCOUNTSTATEMENT_FAIL],
    ping: client => client.post(API_MAP.get_EventAccountStatementDetails, {
      data: { ...queryString },
    }),
  };
}
export function executeAccountPartialTransferDetails(eventId) {
  return {
    types: [ACCOUNTTRANSFER, ACCOUNTTRANSFER_SUCCESS, ACCOUNTTRANSFER_FAIL],
    ping: client => client.post('/api/getAccountPartialTransferDetails', {
      data: {
        "eventId": eventId
      },
    }),
  };
}
export function getPlasticCardDetails(eventId) {
  return {
    types: [GET_PLASTIC_CARD, GET_PLASTIC_CARD_SUCCESS, GET_PLASTIC_CARD_FAIL],
    ping: client => client.post(API_MAP.get_plastic_card_url, {
      data: {
        eventId
      },
    }),
  };
}

export function deletePlasticCardDetails(queryString, plasticCardInfos) {
  return [{
    types: [DELETE_PLASTIC_CARD, DELETE_PLASTIC_CARD_SUCCESS, DELETE_PLASTIC_CARD_FAIL],
    ping: client => client.post(API_MAP.delete_plastic_card_url, {
      data: {
        eventId: queryString.eventId,
        ownerId: queryString.ownerId,
        plasticCardNumber: queryString.plasticCardNumber,
      },
    }),
  },
  {
    types: [GET_PLASTIC_CARD, GET_PLASTIC_CARD_SUCCESS, GET_PLASTIC_CARD_FAIL],
    ping: client => client.post(API_MAP.get_plastic_card_url, {
      data: {
        eventId: queryString.eventId,
      },
    }),
  }
  ]
}
export function addPlasticCard(eventID, ownerID, plasticNumber, celebrity, plasticCardInfos, celebrityInfo) {
  return [{
    types: [ADD_PLASTIC_CARD, ADD_PLASTIC_CARD_SUCCESS, ADD_PLASTIC_CARD_FAIL],
    ping: client => client.post(API_MAP.add_plastic_card_url, {
      data: {
        eventId: eventID,
        ownerId: ownerID,
        plasticCardNumber: plasticNumber,
      },
    }),
  },
  {
    types: [GET_PLASTIC_CARD, GET_PLASTIC_CARD_SUCCESS, GET_PLASTIC_CARD_FAIL],
    ping: client => client.post(API_MAP.get_plastic_card_url, {
      data: {
        eventId: eventID,
      },
    }),
  }
  ];
}
export function setSelectedDashboardUserFailure(data) {
  return async (dispatch) => {
    dispatch({ type: 'SETDASHBOARDUSER_SUCCESS', payload: data });
  }
}

export function setSelectedDashboardUser(params, dashboardUser) {
  let dashboardUserData = {
    dashboardUserName: dashboardUser.userName,
    dashboardUserFirstName: dashboardUser.userFirstName,
    dashboardUserLastName: dashboardUser.userLastName,
    dashboardUserMaternalName: dashboardUser.userMaternalName,
    dashboardUserMiddleName: dashboardUser.userMiddleName,
    dashboardUserEmail: dashboardUser.userEmail,
    dashboardEventId: params && params.eventId,
    dashboardUserRole: dashboardUser.dashboardUserRole,
    id: params && params.profileId,
    dashboardUserId: params && params.ownerId
  }

  return async (dispatch) => {
    dispatch({ type: 'SETDASHBOARDUSER_SUCCESS', payload: dashboardUserData });
  };
}
export function clearDashboardUser() {
  return async (dispatch) => {
    try {
      let dashboardUserData = {
        dashboardUserName: '',
        dashboardUserEmail: '',
        dashboardEventId: ''
      }
      dispatch({ type: 'SETDASHBOARDUSER_SUCCESS', payload: dashboardUserData });
    } catch (e) {
      dispatch({ type: 'SETDASHBOARDUSER_FAILURE', payload: e });
    }
  };
}

export function checkEventForFraud(params) {
  return {
    types: [CHECKEVENTFORFRAUD, CHECKEVENTFORFRAUD_SUCCESS, CHECKEVENTFORFRAUD_FAILURE],
    ping: client => client.post(API_MAP.check_event_for_fraud, {
      data: {
        eventId: params.eventId
      }
    })
  }
}
export function updateEventStatusFailure(response) {
  return async (dispatch) => {
    dispatch({ type: 'UPDATEEVENTSTATUS_FAILURE', payload: response.data });
  }
}
export function updateEventStatus(response) {
  return async (dispatch) => {
    dispatch({ type: 'UPDATEEVENTSTATUS_SUCCESS', payload: response.data });
  };
}