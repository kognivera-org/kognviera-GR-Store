import {
  GET_CLOSING_GIFT_PRICE_RANGE,
  CLOSING_GIFT_PRICE_RANGE_SUCCESSFULL,
  CLOSING_GIFT_PRICE_RANGE_FAIL,

  GET_NOTES,
  GET_NOTES_SUCCESSFULL,
  GET_NOTES_FAIL,

  CREATE_NEW_NOTE,
  CREATE_NEW_NOTE_SUCCESSFULL,
  CREATE_NEW_NOTE_FAIL,

  DELETE_NOTE,
  DELETE_NOTE_SUCCESSFULL,
  DELETE_NOTE_FAIL,

  GET_OPENING_OR_CLOSING_GIFT_DETAILS,
  GET_OPENING_OR_CLOSING_GIFT_DETAILS_SUCCESS,
  GET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE,

  GETEVENTDELIVERYADDRESSES,
  GETEVENTDELIVERYADDRESSES_SUCCESS,
  GETEVENTDELIVERYADDRESSES_FAILURE,

  SET_OPENING_OR_CLOSING_GIFT_DETAILS,
  SET_OPENING_OR_CLOSING_GIFT_DETAILS_SUCCESS,
  SET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE,
  RESET_SET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE_MESSAGE,

  GET_FAILED_TRANSACTION,
  GET_FAILED_TRANSACTION_SUCCESS,
  GET_FAILED_TRANSACTION_FAILURE,

  GET_PLASTIC_CARD,
  GET_PLASTIC_CARD_SUCCESS,
  GET_PLASTIC_CARD_FAIL,

  DELETE_PLASTIC_CARD,
  DELETE_PLASTIC_CARD_SUCCESS,
  DELETE_PLASTIC_CARD_FAIL,

  ADD_PLASTIC_CARD,
  ADD_PLASTIC_CARD_SUCCESS,
  ADD_PLASTIC_CARD_FAIL,

  CLEAR_PLATIC_CARD_SERVER_ERROR,

  CHECKEVENTFORFRAUD,
  CHECKEVENTFORFRAUD_SUCCESS,
  CHECKEVENTFORFRAUD_FAILURE,

  UPDATEEVENTSTATUS,
  UPDATEEVENTSTATUS_SUCCESS,
  UPDATEEVENTSTATUS_FAILURE,

} from './actions';


const EVENTDETAIL_SUCCESS = 'eventdetails/EVENTDETAIL_SUCCESS';
const EVENTDETAIL_FAIL = 'eventdetails/EVENTDETAIL_FAIL';
const EVENTDETAIL = 'eventdetails/EVENTDETAIL';
const GIFTANDPURCHASE_SUCCESS = 'eventdetails/GIFTANDPURCHASE_SUCCESS';
const GIFTANDPURCHASE_FAIL = 'eventdetails/GIFTANDPURCHASE_FAIL';
const GIFTANDPURCHASE = 'eventdetails/GIFTANDPURCHASE';
const EVENTACCOUNTSTATEMENT_SUCCESS = 'eventdetails/EVENTACCOUNTSTATEMENT_SUCCESS';
const EVENTACCOUNTSTATEMENT_FAIL = 'eventdetails/EVENTACCOUNTSTATEMENT_FAIL';
const EVENTACCOUNTSTATEMENT = 'eventdetails/EVENTACCOUNTSTATEMENT';
const ACCOUNTTRANSFER_SUCCESS = 'eventdetails/ACCOUNTTRANSFER_SUCCESS';
const ACCOUNTTRANSFER_FAIL = 'eventdetails/ACCOUNTTRANSFER_FAIL';
const ACCOUNTTRANSFER = 'eventdetails/ACCOUNTTRANSFER';
const SETDASHBOARDUSER = 'SETDASHBOARDUSER';
const SETDASHBOARDUSER_SUCCESS = 'SETDASHBOARDUSER_SUCCESS';
const SETDASHBOARDUSER_FAILURE = 'SETDASHBOARDUSER_FAILURE';

const initialState = {
  getNotesLoading: true,
  getNotesFailed: false,
  deleteNoteLoading: true,
  deleteNoteFailed: false,
  createNewNoteLoading: true,
  createNewNoteFailed: false,
  notes: {},
  closingGiftPriceRangeInfo: {},
  // closingGiftPriceRangeInfoLoading: true,
  closingGiftPriceRangeInfoFailed: false,
  eventDataLoading: true,
  eventData: {},
  eventDataFailed: false,
  giftPurchaseDataLoading: true,
  giftPurchaseData: {},
  giftPurchaseFailed: false,
  eventAccountStatementDataLoading: true,
  eventAccountStatementData: {},
  eventAccountStatementFailed: false,
  accountTransferDataLoading: true,
  accountTransferData: {},
  accountTransferFailed: false,
  getPlasticCardDataLoading: true,
  deletePlasticCardDataLoading: false,
  addPlasticCardDataLoading: false,
  addPlasticCardFailedMessage: "",
  plasticCardsData: {},
  openingOrClosingGiftDetailsForEventLoading: true,
  openingOrClosingGiftDetailsForEventFailed: false,
  setOpeningOrClosingGiftDetailsForEventLoading: true,
  setOpeningOrClosingGiftDetailsForEventFailed: false,
  setOpeningOrClosingGiftDetailsForEventErrorMessage: {},
  openingOrClosingGiftDetailsForEvent: {},
  eventDeliveryAddress: {},
  eventDeliveryAddressFailed: false,
  eventDeliveryAddressLoading: true,
  dashboardUser: {},
  failedTransactionLoading: true,
  failedTransaction: {},
  failedTransactionFailed: false,

  checkEventForFraud: {},
  checkEventForFraudFailed: false,
  checkEventForFraudLoading: true,
  //updateEventStatus: {},
  updateEventStatusFailed: false,
  updateEventStatusLoading: true,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_FAILED_TRANSACTION: return {
      ...state,
      failedTransactionLoading: true,
      failedTransaction: {},
      failedTransactionFailed: false,
    }
    case GET_FAILED_TRANSACTION_SUCCESS: return {
      ...state,
      failedTransactionLoading: false,
      failedTransaction: action.payload,
      failedTransactionFailed: false,
    }
    case GET_FAILED_TRANSACTION_FAILURE: return {
      ...state,
      failedTransactionLoading: false,
      failedTransaction: {},
      failedTransactionFailed: true,
    }
    case GETEVENTDELIVERYADDRESSES: return {
      ...state,
      eventDeliveryAddress: {},
      eventDeliveryAddressFailed: false,
      eventDeliveryAddressLoading: true
    }
    case GETEVENTDELIVERYADDRESSES_SUCCESS: return {
      ...state,
      eventDeliveryAddress: action.payload,
      eventDeliveryAddressFailed: false,
      eventDeliveryAddressLoading: false
    }
    case GETEVENTDELIVERYADDRESSES_FAILURE: return {
      ...state,
      eventDeliveryAddress: {},
      eventDeliveryAddressFailed: true,
      eventDeliveryAddressLoading: false
    }
    case SET_OPENING_OR_CLOSING_GIFT_DETAILS:
      return {
        ...state,
        setOpeningOrClosingGiftDetailsForEventLoading: true,
        setOpeningOrClosingGiftDetailsForEventFailed: false,
        setOpeningOrClosingGiftDetailsForEventErrorMessage: {}
      }
    case SET_OPENING_OR_CLOSING_GIFT_DETAILS_SUCCESS:
      return {
        ...state,
        setOpeningOrClosingGiftDetailsForEventLoading: false,
        setOpeningOrClosingGiftDetailsForEventFailed: false,
      }
    case SET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE:
      return {
        ...state,
        setOpeningOrClosingGiftDetailsForEventLoading: false,
        setOpeningOrClosingGiftDetailsForEventFailed: true,
        setOpeningOrClosingGiftDetailsForEventErrorMessage: action.payload
      }
    case RESET_SET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE_MESSAGE:
      return {
        ...state,
        setOpeningOrClosingGiftDetailsForEventLoading: true,
        setOpeningOrClosingGiftDetailsForEventFailed: false,
        setOpeningOrClosingGiftDetailsForEventErrorMessage: {}
      }
    case GET_OPENING_OR_CLOSING_GIFT_DETAILS:
      return {
        ...state,
        openingOrClosingGiftDetailsForEventLoading: true,
        openingOrClosingGiftDetailsForEventFailed: false,
        openingOrClosingGiftDetailsForEvent: {}
      }
    case GET_OPENING_OR_CLOSING_GIFT_DETAILS_SUCCESS:
      return {
        ...state,
        openingOrClosingGiftDetailsForEventLoading: false,
        openingOrClosingGiftDetailsForEventFailed: false,
        openingOrClosingGiftDetailsForEvent: action.payload
      }
    case GET_OPENING_OR_CLOSING_GIFT_DETAILS_FAILURE:
      return {
        ...state,
        openingOrClosingGiftDetailsForEventLoading: false,
        openingOrClosingGiftDetailsForEventFailed: true,
        openingOrClosingGiftDetailsForEvent: action.payload
      }
    case GET_NOTES:
      return {
        ...state,
        getNotesLoading: true,
        getNotesFailed: false,
        notes: {}
      };
    case GET_NOTES_SUCCESSFULL:
      return {
        ...state,
        getNotesLoading: false,
        getNotesFailed: false,
        notes: action.payload
      };
    case GET_NOTES_FAIL:
      return {
        ...state,
        getNotesLoading: false,
        getNotesFailed: true,
        notes: {}
      };
    case CREATE_NEW_NOTE:
      return {
        ...state,
        createNewNoteLoading: true,
        createNewNoteFailed: false,
      };
    case CREATE_NEW_NOTE_SUCCESSFULL:
      return {
        ...state,
        createNewNoteLoading: false,
        createNewNoteFailed: false,
      };
    case CREATE_NEW_NOTE_FAIL:
      return {
        ...state,
        createNewNoteLoading: false,
        createNewNoteFailed: true,
      };
    case DELETE_NOTE:
      return {
        ...state,
        deleteNoteLoading: true,
        deleteNoteFailed: false,
      };
    case DELETE_NOTE_SUCCESSFULL:
      return {
        ...state,
        deleteNoteLoading: false,
        deleteNoteFailed: false,
      };
    case DELETE_NOTE_FAIL:
      return {
        ...state,
        deleteNoteLoading: false,
        deleteNoteFailed: true,
      };
    case GET_CLOSING_GIFT_PRICE_RANGE:
      return {
        ...state,
        closingGiftPriceRangeInfo: {},
        closingGiftPriceRangeInfoLoading: true,
        closingGiftPriceRangeInfoFailed: false,
      };
    case CLOSING_GIFT_PRICE_RANGE_SUCCESSFULL:
      return {
        ...state,
        closingGiftPriceRangeInfo: action.payload,
        closingGiftPriceRangeInfoLoading: false,
        closingGiftPriceRangeInfoFailed: false,
      };
    case CLOSING_GIFT_PRICE_RANGE_FAIL:
      return {
        ...state,
        closingGiftPriceRangeInfo: {},
        closingGiftPriceRangeInfoLoading: false,
        closingGiftPriceRangeInfoFailed: true,
      };
    case EVENTDETAIL:
      return {
        ...state,
        eventDataLoading: true,
        eventData: {},
      };
    case EVENTDETAIL_FAIL:
      return {
        ...state,
        eventData: {},
        eventDataLoading: false,
        eventDataFailed: true,
      };
    case EVENTDETAIL_SUCCESS:
      return {
        ...state,
        eventDataLoading: false,
        eventData: action.payload,
      };
    case GIFTANDPURCHASE:
      return {
        ...state,
        giftPurchaseDataLoading: true,

      };
    case GIFTANDPURCHASE_FAIL:
      return {
        ...state,
        giftPurchaseDataLoading: false,
        giftPurchaseFailed: true,
      };
    case GIFTANDPURCHASE_SUCCESS:
      return {
        ...state,
        giftPurchaseDataLoading: false,
        giftPurchaseData: action.payload,
      };
    case EVENTACCOUNTSTATEMENT:
      return {
        ...state,
        eventAccountStatementDataLoading: true,
      };
    case EVENTACCOUNTSTATEMENT_FAIL:
      return {
        ...state,
        eventAccountStatementDataLoading: false,
        eventAccountStatementFailed: true,
      };
    case EVENTACCOUNTSTATEMENT_SUCCESS:
      return {
        ...state,
        eventAccountStatementDataLoading: false,
        eventAccountStatementData: action.payload,
      };
    case ACCOUNTTRANSFER:
      return {
        ...state,
        accountTransferDataLoading: true,
      };
    case ACCOUNTTRANSFER_FAIL:
      return {
        ...state,
        accountTransferDataLoading: false,
        accountTransferFailed: true,
      };
    case ACCOUNTTRANSFER_SUCCESS:
      return {
        ...state,
        accountTransferDataLoading: false,
        accountTransferData: action.payload,
      };
    case GET_PLASTIC_CARD:
      return {
        ...state,
      };
    case GET_PLASTIC_CARD_SUCCESS:
      return {
        ...state,
        getPlasticCardDataLoading: false,
        plasticCardsData: action.payload,
      };
    case GET_PLASTIC_CARD_FAIL:
      return {
        ...state,
        getPlasticCardDataLoading: false,
        getPlasticCardFailed: true,
      };
    case DELETE_PLASTIC_CARD:
      return {
        ...state,
        deletePlasticCardDataLoading: true,
      };
    case DELETE_PLASTIC_CARD_SUCCESS:
      return {
        ...state,
        deletePlasticCardDataLoading: false,
        plasticCardsData: {
          ...state.plasticCardsData,
          plasticCardInfos: action.payload,
        }
      };
    case DELETE_PLASTIC_CARD_FAIL:
      return {
        ...state,
        deletePlasticCardDataLoading: false,
        deletePlasticCardFailed: true,
      };
    case ADD_PLASTIC_CARD:
      return {
        ...state,
        addPlasticCardFailedMessage: "",
        // addPlasticCardDataLoading: true,
      };
    case ADD_PLASTIC_CARD_SUCCESS:
      return {
        ...state,
        addPlasticCardFailedMessage: "",
        addPlasticCardDataLoading: false,
      };
    case ADD_PLASTIC_CARD_FAIL:
      return {
        ...state,
        addPlasticCardFailedMessage: action.payload,
        addPlasticCardDataLoading: false,
        addPlasticCardFailed: true,
      };
    case CLEAR_PLATIC_CARD_SERVER_ERROR: return {
      ...state,
      addPlasticCardFailedMessage: "",
    };
    case SETDASHBOARDUSER:
      return {
        ...state,
        dashboardUserLoading: true,
      };
    case SETDASHBOARDUSER_SUCCESS:
      return {
        ...state,
        dashboardUserLoading: false,
        dashboardUser: action.payload
      };
    case SETDASHBOARDUSER_FAILURE:
      return {
        ...state,
        dashboardUserLoading: false,
        dashboardUserFailed: true,
      };

    case CHECKEVENTFORFRAUD: return {
      ...state,
      checkEventForFraud: {},
      checkEventForFraudFailed: false,
      checkEventForFraudLoading: true
    }
    case CHECKEVENTFORFRAUD_SUCCESS:
      return {
        ...state,
        checkEventForFraud: action.payload,
        checkEventForFraudFailed: false,
        checkEventForFraudLoading: false
      }
    case CHECKEVENTFORFRAUD_FAILURE: return {
      ...state,
      checkEventForFraud: {},
      checkEventForFraudFailed: true,
      checkEventForFraudLoading: false
    }

    case UPDATEEVENTSTATUS: return {
      ...state,
      updateEventStatus: null,
      updateEventStatusFailed: false,
      updateEventStatusLoading: true
    }
    case UPDATEEVENTSTATUS_SUCCESS:
      return {
        ...state,
        updateEventStatus: action.payload,
        updateEventStatusFailed: false,
        updateEventStatusLoading: false
      }
    case UPDATEEVENTSTATUS_FAILURE: return {
      ...state,
      updateEventStatus: null,
      updateEventStatusFailed: true,
      updateEventStatusLoading: false
    }
    default:
      return state;
  }
}
