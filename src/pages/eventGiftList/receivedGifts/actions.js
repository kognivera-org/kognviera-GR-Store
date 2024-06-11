
export const GET_RECEIVED_GIFT_LIST = 'GET_RECEIVED_GIFT_LIST';
export const GET_RECEIVED_GIFT_LIST_SUCCESS = 'GET_RECEIVED_GIFT_LIST_SUCCESS';
export const GET_RECEIVED_GIFT_LIST_FAIL = 'GET_RECEIVED_GIFT_LIST_FAIL';
export const GET_PURCHASE_TICKET_INFO = 'GET_PURCHASE_TICKET_INFO';
export const GET_PURCHASE_TICKET_INFO_SUCCESS = 'GET_PURCHASE_TICKET_INFO_SUCCESS';
export const GET_PURCHASE_TICKET_INFO_FAIL = 'GET_PURCHASE_TICKET_INFO_FAIL';
export const GET_TRACK_ORDER_INFO = 'GET_TRACK_ORDER_INFO';
export const GET_TRACK_ORDER_INFO_SUCCESS = 'GET_TRACK_ORDER_INFO_SUCCESS';
export const GET_TRACK_ORDER_INFO_FAIL = 'GET_TRACK_ORDER_INFO_FAIL';
export const ASSOCIATE_PURCHASE_TICKET = 'ASSOCIATE_PURCHASE_TICKET';
export const ASSOCIATE_PURCHASE_TICKET_SUCCESS = 'ASSOCIATE_PURCHASE_TICKET_SUCCESS';
export const ASSOCIATE_PURCHASE_TICKET_FAIL = 'ASSOCIATE_PURCHASE_TICKET_FAIL';
export const DISSOCIATE_PURCHASE_TICKET = 'DISSOCIATE_PURCHASE_TICKET';
export const DISSOCIATE_PURCHASE_TICKET_SUCCESS = 'DISSOCIATE_PURCHASE_TICKET_SUCCESS';
export const DISSOCIATE_PURCHASE_TICKET_FAIL = 'DISSOCIATE_PURCHASE_TICKET_FAIL';
export const DISSOCIATE_PURCHASE_TICKET_BY_BUTTON = 'DISSOCIATE_PURCHASE_TICKET_BY_BUTTON';
export const DISSOCIATE_PURCHASE_TICKET_BY_BUTTON_SUCCESS = 'DISSOCIATE_PURCHASE_TICKET_BY_BUTTON_SUCCESS';
export const DISSOCIATE_PURCHASE_TICKET_BY_BUTTON_FAIL = 'DISSOCIATE_PURCHASE_TICKET_BY_BUTTON_FAIL';
export const GET_MESSAGE = 'GET_MESSAGE';
export const GET_MESSAGE_SUCCESS = 'GET_MESSAGE_SUCCESS';
export const GET_MESSAGE_FAIL = 'GET_MESSAGE_FAIL';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const ADD_MESSAGE_SUCCESS = 'ADD_MESSAGE_SUCCESS';
export const ADD_MESSAGE_FAIL = 'ADD_MESSAGE_FAIL';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const DELETE_MESSAGE_SUCCESS = 'DELETE_MESSAGE_SUCCESS';
export const DELETE_MESSAGE_FAIL = 'DELETE_MESSAGE_FAIL';
export const ADD_MESSAGE_ITEM = 'ADD_MESSAGE_ITEM';
export const DELETE_MESSAGE_ITEM = 'DELETE_MESSAGE_ITEM'
// Received List

export function getReceivedGiftList(params) {

  return {
    types: [GET_RECEIVED_GIFT_LIST, GET_RECEIVED_GIFT_LIST_SUCCESS, GET_RECEIVED_GIFT_LIST_FAIL],
    ping: client => client.post('/api/getRegaloRecibidos', {
      data: { ...params }
    })

  };
}
export function getPurchaseTicketDetail(params) {

  return {
    types: [GET_PURCHASE_TICKET_INFO, GET_PURCHASE_TICKET_INFO_SUCCESS, GET_PURCHASE_TICKET_INFO_FAIL],
    ping: client => client.post('/api/getPurchaseTicketDetails', {
      data: { ...params }
    })
  };
}
export function getTrackOrderData(params) {

  return {
    types: [GET_TRACK_ORDER_INFO, GET_TRACK_ORDER_INFO_SUCCESS, GET_TRACK_ORDER_INFO_FAIL],
    ping: client => client.post('/api/getTrackOrder', {
      data: { ...params }
    })
  };
}
export function associatePurchaseTicket(params) {

  return {
    types: [ASSOCIATE_PURCHASE_TICKET, ASSOCIATE_PURCHASE_TICKET_SUCCESS, ASSOCIATE_PURCHASE_TICKET_FAIL],
    ping: client => client.post('/api/associatePurchaseTicket', {
      data: { ...params }
    })
  };
}
export function dissociatePurchaseTicket(params) {

  return {
    types: [DISSOCIATE_PURCHASE_TICKET, DISSOCIATE_PURCHASE_TICKET_SUCCESS, DISSOCIATE_PURCHASE_TICKET_FAIL],
    ping: client => client.post('/api/dissociatePurchaseTicket', {
      data: { ...params }
    })
  };
}
export function disassociatePurchasedTicketByButton(params) {

  return {
    types: [DISSOCIATE_PURCHASE_TICKET_BY_BUTTON, DISSOCIATE_PURCHASE_TICKET_BY_BUTTON_SUCCESS, DISSOCIATE_PURCHASE_TICKET_BY_BUTTON_FAIL],
    ping: client => client.post('/api/disassociatePurchasedTicketByButton', {
      data: { ...params }
    })
  };
}

export function getMessages(params) {

  return {
    types: [GET_MESSAGE, GET_MESSAGE_SUCCESS, GET_MESSAGE_FAIL],
    ping: client => client.post('/api/getMessages', {
      data: { ...params }
    })
  };
}
export function addMessages(params) {

  return {
    types: [ADD_MESSAGE, ADD_MESSAGE_SUCCESS, ADD_MESSAGE_FAIL],
    ping: client => client.post('/api/addMessage', {
      data: { ...params }
    })
  };
}
export function deleteMessages(params) {

  return {
    types: [DELETE_MESSAGE, DELETE_MESSAGE_SUCCESS, DELETE_MESSAGE_FAIL],
    ping: client => client.post('/api/deleteMessage', {
      data: { ...params }
    })
  };
}
export function addMessageItem(params) {
  return {
    type: ADD_MESSAGE_ITEM,
    payload: params
  };
}
export function deleteMessageItem(params) {
  return {
    type: DELETE_MESSAGE_ITEM,
    payload: params
  };
}