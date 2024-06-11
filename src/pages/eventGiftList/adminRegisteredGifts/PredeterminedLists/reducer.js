// import { MASTER_PAGE_LOAD, MASTER_PAGE_LOAD_SUCCESS, MASTER_PAGE_LOAD_FAIL } from './actions';
import {
  GET_PREDETERMINED_LANDING_PAGE_LOAD, GET_PREDETERMINED_LANDING_PAGE_LOAD_SUCCESS, GET_PREDETERMINED_LANDING_PAGE_LOAD_FAIL,
  ADD_PREDETERMINED_ITEM_LOAD, ADD_PREDETERMINED_ITEM_LOAD_SUCCESS, ADD_PREDETERMINED_ITEM_LOAD_FAIL,
  PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD, PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD_SUCCESS, PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD_FAIL,
  PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD, PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD_SUCCESS, PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD_FAIL,
  FILTERED_PRODUCT,
  PRODUCT_PER_PAGE,

} from './actions';

const initialState = {
  loaded: false,
  editing: {},
  saveError: {},
  //   data: { predeterminedLandingPage: {}, deliveryDayNotApplicables: {} },
  data: {
    predeterminedLanding: null,
    addPredeterminedItemButton: null,
    predeterminedHeaderInfo: null,
    predeterminedItemsDetailsInfo: null,
  },
  extraData: {},
};

export default function predeterminedLists(state = initialState, action = {}) {
  switch (action.type) {
    case GET_PREDETERMINED_LANDING_PAGE_LOAD:
      return {
        ...state,
        loading: true,
      };
    case GET_PREDETERMINED_LANDING_PAGE_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        data: {
          ...state.data,
          predeterminedLanding: action.payload,
        },
        error: null,
        extraData: 'This is extra info..........',
      };
    }
    case GET_PREDETERMINED_LANDING_PAGE_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error,
      };
    case ADD_PREDETERMINED_ITEM_LOAD:
      return {
        ...state,
        loading: true,
      };
    case ADD_PREDETERMINED_ITEM_LOAD_SUCCESS: {
      // const a = JSON.stringify(action.result);
      return {
        ...state,
        loading: false,
        loaded: true,
        data: {
          ...state.data,
          addPredeterminedItemButton: action.payload,
        },
        error: null,
        extraData: 'This is extra info..........',
      };
    }
    case ADD_PREDETERMINED_ITEM_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error,
      };

    case PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD:
      return {
        ...state,
        loading: true,
      };
    case PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD_SUCCESS: {
      // const a = JSON.stringify(action.result);
      return {
        ...state,
        loading: false,
        loaded: true,
        data: {
          ...state.data,
          predeterminedHeaderInfo: action.payload,
        },
        error: null,
        extraData: 'This is extra info..........',
      };
    }
    case PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: {},
        error: action.error,
      };

    case PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD:
      return {
        ...state,
        loading: true,
      };
    case PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD_SUCCESS: {
      // const a = JSON.stringify(action.result);
      return {
        ...state,
        loading: false,
        loaded: true,
        data: {
          ...state.data,
          predeterminedItemsDetailsInfo: action.payload,
        },
        filteredResult: {
          ...state.data,
          predeterminedItemsDetailsInfo: action.Result,
        },
        currentPage: 1,
        productPerPageOfPagination: 10,
        products: [],
        error: null,
        extraData: 'This is extra info..........',
      };
    }
    case PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: {},
        error: action.error,
      };
    case FILTERED_PRODUCT:
      return {
        ...state,
        data: {
          ...state.data,
          predeterminedItemsDetailsInfo: action.payload,
        },
      };
    case PRODUCT_PER_PAGE:
      return {
        ...state,
        products: action.data.newFilterProductResult,
        filteredResult: action.data.products,
      };

    default:
      return state;
  }
}
