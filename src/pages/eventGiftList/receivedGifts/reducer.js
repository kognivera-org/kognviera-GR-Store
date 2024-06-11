
import * as regalorecibidos from './actions';
const initialState = {
    eventDataLoading: true,
    eventData: {},
    eventDataFailed: false,
    purchaseTicketDataLoading: true,
    purchaseTicketData: {},
    purchaseTicketDataFailed: false,
    trackOrderDataLoading: true,
    trackOrderData: {},
    trackOrderDataFailed: false,
    associatePurchaseTicketLoading: true,
    associatePurchaseTicket: {},
    associatePurchaseTicketFailed: false,
    dissociatePurchaseTicketLoading: true,
    dissociatePurchaseTicket: {},
    dissociatePurchaseTicketFailed: false,
    getMessageDataLoading: true,
    getMessageData: {},
    getMessageDataFailed: false,
    dissociatePurchaseTicketByButtonLoading: true,
    dissociatePurchaseTicketByButton: {},
    dissociatePurchaseTicketByButtonFailed: false,
    itemsInfo: [],
    messageActionItem: {},
};
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case regalorecibidos.GET_RECEIVED_GIFT_LIST:
            return {
                ...state,
                eventDataLoading: true,
            };
        case regalorecibidos.GET_RECEIVED_GIFT_LIST_SUCCESS:
            //const itemsInfo = action.payload && action.payload.currentPage === '1' ? action.payload.itemsInfo : [...state.itemsInfo, ...action.payload.itemsInfo]
            return {
                ...state,
                eventDataLoading: false,
                eventData: action.payload,
                //itemsInfo: itemsInfo
            };
        case regalorecibidos.GET_RECEIVED_GIFT_LIST_FAIL:
            return {
                ...state,
                eventDataLoading: false,
                eventDataFailed: true,
            };
        case regalorecibidos.GET_PURCHASE_TICKET_INFO:
            return {
                ...state,
                purchaseTicketDataLoading: true,
                purchaseTicketDataFailed: false
            };
        case regalorecibidos.GET_PURCHASE_TICKET_INFO_SUCCESS:
            return {
                ...state,
                purchaseTicketDataLoading: false,
                purchaseTicketData: action.payload,
            };
        case regalorecibidos.GET_PURCHASE_TICKET_INFO_FAIL:
            return {
                ...state,
                purchaseTicketDataLoading: false,
                purchaseTicketDataFailed: true,
            };
        case regalorecibidos.GET_TRACK_ORDER_INFO:
            return {
                ...state,
                trackOrderDataLoading: true,
            };
        case regalorecibidos.GET_TRACK_ORDER_INFO_SUCCESS:
            return {
                ...state,
                trackOrderDataLoading: false,
                trackOrderData: action.payload,
            };
        case regalorecibidos.GET_TRACK_ORDER_INFO_FAIL:
            return {
                ...state,
                trackOrderDataLoading: false,
                trackOrderDataFailed: true,
            };
        case regalorecibidos.ASSOCIATE_PURCHASE_TICKET:
            return {
                ...state,
                associatePurchaseTicketLoading: true,
            };
        case regalorecibidos.ASSOCIATE_PURCHASE_TICKET_SUCCESS:
            return {
                ...state,
                associatePurchaseTicketLoading: false,
                associatePurchaseTicket: action.payload,
            };
        case regalorecibidos.ASSOCIATE_PURCHASE_TICKET_FAIL:
            return {
                ...state,
                associatePurchaseTicketLoading: false,
                associatePurchaseTicketFailed: true,
                associatePurchaseTicket: action.payload,
            };
        case regalorecibidos.DISSOCIATE_PURCHASE_TICKET:
            return {
                ...state,
                dissociatePurchaseTicketLoading: true,
            };
        case regalorecibidos.DISSOCIATE_PURCHASE_TICKET_SUCCESS:
            return {
                ...state,
                dissociatePurchaseTicketLoading: false,
                dissociatePurchaseTicket: action.payload,
            };
        case regalorecibidos.DISSOCIATE_PURCHASE_TICKET_FAIL:
            return {
                ...state,
                dissociatePurchaseTicketLoading: false,
                dissociatePurchaseTicketFailed: true,
                dissociatePurchaseTicket: action.payload,
            };
        case regalorecibidos.DISSOCIATE_PURCHASE_TICKET_BY_BUTTON:
            return {
                ...state,
                dissociatePurchaseTicketByButtonLoading: true,
            };
        case regalorecibidos.DISSOCIATE_PURCHASE_TICKET_BY_BUTTON_SUCCESS:
            return {
                ...state,
                dissociatePurchaseTicketByButtonLoading: false,
                dissociatePurchaseTicketByButton: action.payload,
            };
        case regalorecibidos.DISSOCIATE_PURCHASE_TICKET_BY_BUTTON_FAIL:
            return {
                ...state,
                dissociatePurchaseTicketByButtonLoading: false,
                dissociatePurchaseTicketByButtonFailed: true,
                dissociatePurchaseTicketByButton: action.payload,
            };
        case regalorecibidos.GET_MESSAGE:
            return {
                ...state,
                getMessageDataLoading: true,
            };
        case regalorecibidos.GET_MESSAGE_SUCCESS:
            return {
                ...state,
                getMessageDataLoading: false,
                getMessageData: action.payload,
            };
        case regalorecibidos.GET_MESSAGE_FAIL:
            return {
                ...state,
                getMessageDataLoading: false,
                getMessageDataFailed: true,
                getMessageData: action.payload,
            };
        case regalorecibidos.ADD_MESSAGE_ITEM:
            return {
                ...state,
                messageActionItem: action.payload,
            };
        case regalorecibidos.DELETE_MESSAGE_ITEM:
            return {
                ...state,
                messageActionItem: action.payload,
            };
        default:
            return state;
    }
}