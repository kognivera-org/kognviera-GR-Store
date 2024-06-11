const initialState = {
  loading: false,
  data: {},
  statementPrintDownload: {},
  purchasedItemSummaryInfo: {},
  purchasedItemsDetails: {},
  verifyStoreDetails: {},
  transferenceData: {},
  submitTransference: {},
  calculateCommision: {},
  eventSummarydata: {},
  accountPartialTransfer: {},
  saveBankOrCardDetail: null,

};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case 'ACCOUNTSTATEMENT_DETAILS':
      return {
        ...state,
        loading: true,

      };
    case 'ACCOUNTSTATEMENT_DETAILS_SUCCESS':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
        loading: false,
        error: undefined,

      };
    case 'ACCOUNTSTATEMENT_DETAILS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'PURCHASEDITEMSUMMARYINFO_LOAD':
      return {
        ...state,
        loading: true,

      };
    case 'PURCHASEDITEMSUMMARYINFO_LOAD_SUCCESS':
      return {
        ...state,
        purchasedItemSummaryInfo: { ...state.data, ...action.payload },
        loading: true,
        error: undefined,

      };
    case 'PURCHASEDITEMSUMMARYINFO_LOAD_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'PURCHASEDITEMSDETAILS_LOAD':
      return {
        ...state,
        loading: true,

      };
    case 'PURCHASEDITEMSDETAILS_LOAD_SUCCESS':
      return {
        ...state,
        purchasedItemsDetails: { ...state.data, ...action.payload },
        loading: true,
        error: undefined,

      };
    case 'PURCHASEDITEMSDETAILS_LOAD_FAIL':
      return {
        ...state,
        loading: false,
        purchasedItemsDetails: null,
        error: action.payload,
      };

    case 'BONUS_DETAILS':
      return {
        ...state,
        loading: true,

      };
    case 'BONUS_DETAILS_SUCCESS':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
        loading: false,
        error: undefined,

      };
    case 'BONUS_DETAILS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'IN_TRANSIT_DETAILS':
      return {
        ...state,
        loading: true,

      };
    case 'IN_TRANSIT_DETAILS_SUCCESS':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
        loading: true,
        error: undefined,

      };
    case 'IN_TRANSIT_DETAILS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'TRANSFERENCE_OPTIONS':
      return {
        ...state,
        loading: true,

      };
    case 'TRANSFERENCE_OPTIONS_SUCCESS':
      return {
        ...state,
        transferenceData: { ...state.data, ...action.payload },
        loading: false,
        error: undefined,

      };
    case 'TRANSFERENCE_OPTIONS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'VERIFY_STORE_ASSOCIATE':
      return {
        ...state,
        loading: true,

      };
    case 'VERIFY_STORE_ASSOCIATE_SUCCESS':
      return {
        ...state,
        verifyStoreDetails: { ...state.data, ...action.payload },
        loading: false,
        error: undefined,

      };
    case 'VERIFY_STORE_ASSOCIATE_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'SUBMIT_TRANSFERENCE_DETAILS':
      return {
        ...state,
        loading: true,

      };
    case 'SUBMIT_TRANSFERENCE_DETAILS_SUCCESS':
      return {
        ...state,
        submitTransference: { ...state.data, ...action.payload },
        loading: false,
        error: undefined,

      };
    case 'SUBMIT_TRANSFERENCE_DETAILS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'CALCULATE_COMMOSION':
      return {
        ...state,
        loading: true,

      };
    case 'CALCULATE_COMMOSION_SUCCESS':
      return {
        ...state,
        calculateCommision: { ...state.data, ...action.payload },
        loading: false,
        error: undefined,

      };
    case 'CALCULATE_COMMOSION_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'EVENTSUMMARY_INFO':
      return {
        ...state,
        loading: true,

      };
    case 'EVENTSUMMARY_SUCCESS':
      return {
        ...state,
        eventSummarydata: { ...state.data, ...action.payload },
        loading: true,
        error: undefined,

      };
    case 'EVENTSUMMARY_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'SAVEBANKORCARD_DETAILS':
      return {
        ...state,
        loading: true,

      };
    case 'SAVEBANKORCARD_DETAILS_SUCCESS':
      return {
        ...state,
        saveBankOrCardDetail: { ...state.data, ...action.payload },
        loading: false,
        error: undefined,

      };
    case 'SAVEBANKORCARD_DETAILS_FAIL':
      return {
        ...state,
        saveBankOrCardDetail: null,
        loading: false,
        error: action.payload,
      };
    case 'ACCOUNT_PARTIAL_TRANSFERENCE':
      return {
        ...state,
        loading: true,

      };
    case 'ACCOUNT_PARTIAL_TRANSFERENCE_SUCCESS':
      return {
        ...state,
        accountPartialTransfer: { ...state.data, ...action.payload },
        loading: true,
        error: undefined,

      };
    case 'ACCOUNT_PARTIAL_TRANSFERENCE_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'SUBMIT_REFUND': // return and refunds
      return {
        ...state,
        loading: true,
      };
    case 'SUBMIT_REFUND_SUCCESS': // return and refunds
      return {
        ...state,
        submitTransference: { ...state.data, ...action.payload },
        loading: false,
        error: undefined,
      };
    case 'SUBMIT_REFUND_FAIL': // return and refunds
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'STATEMENT_PRINT_DOWNLOAD':
      return {
        ...state,
        loading: true,
      };
    case 'STATEMENT_PRINT_DOWNLOAD_SUCCESS':
      return {
        ...state,
        statementPrintDownload: { ...state.data, ...action.payload },
        loading: true,
        error: undefined,
      };
    case 'STATEMENT_PRINT_DOWNLOAD_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default: return state;
  }
}
