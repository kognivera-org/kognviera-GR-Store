import {
  GET_GIFT_LIST_GUEST_VIEW, GET_GIFT_LIST_GUEST_VIEW_SUCCESS, GET_GIFT_LIST_GUEST_VIEW_FAIL,
  SET_FAVOURITE, SET_FAVOURITE_SUCCESS, SET_FAVOURITE_FAIL
} from './actions';

const initialState = {
  loaded: false,
  data: { giftListGuestView: {} },
  categoryItemsInfo: [],
  extraData: {},
  favouritesuccess: false,
  eventDataFailed: false,
};

export default function GiftList(state = initialState, action = {}) {
  switch (action.type) {
    case GET_GIFT_LIST_GUEST_VIEW:
      return {
        ...state,
        loading: true,
      };
    case GET_GIFT_LIST_GUEST_VIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: {
          ...state.data,
          giftListGuestView: action.payload,
        },
        quantitysuccess: false,
        favouritesuccess: false,
        // ...state.data,
        // registeredGiftList: {
        //     originalRegisteredGiftList: action.result,
        //     appliedFilter: [],
        //     filteredRegisteredGiftList: action.result,
        // },
        error: null,
        eventDataFailed: false,
        extraData: 'This is extra info..........',
      };
    case GET_GIFT_LIST_GUEST_VIEW_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error,
        eventDataFailed: true,
      };

    case SET_FAVOURITE:
      return {
        ...state,
        loading: true,
      };
    case SET_FAVOURITE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        favouritesuccess: action.payload.status,
        error: null,
        extraData: 'This is extra info..........',
      };
    case SET_FAVOURITE_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      };
    default: return state;
  }
}
