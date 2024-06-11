import {
  FETCH_BRAND, GET_REGISTERED_GIFT_LIST, GET_REGISTERED_GIFT_LIST_SUCCESS, GET_REGISTERED_GIFT_LIST_FAIL, CHANGE_DELIVERY_ADDRESS, CHANGE_DELIVERY_ADDRESS_SUCCESS, CHANGE_DELIVERY_ADDRESS_FAIL, CHANGE_DELIVERY_MODE, CHANGE_DELIVERY_MODE_SUCCESS, CHANGE_DELIVERY_MODE_FAIL, REMOVE_GIFT, REMOVE_GIFT_SUCCESS, REMOVE_GIFT_FAIL, SAVE_QUANTITY, SAVE_QUANTITY_SUCCESS, SAVE_QUANTITY_FAIL, SET_FAVOURITE, SET_FAVOURITE_SUCCESS, SET_FAVOURITE_FAIL
} from './action';

const initialState = {
  loaded: false,
  loading: true,
  eventDataFailed: false,
  editing: {},
  saveError: {},
  data: { registeredGiftList: {} },
  categoryItemsInfo: [],
  extraData: {},
  quantitysuccess: false,
  favouritesuccess: false,
  categoryInfo: [],
};

export default function GiftList(state = initialState, action = {}) {
  switch (action.type) {
    case GET_REGISTERED_GIFT_LIST:
      return {
        ...state,
        loading: true,
      };
    case GET_REGISTERED_GIFT_LIST_SUCCESS:
      // console.log('GET_REGISTERED_GIFT_LIST_SUCCESS', action.payload)
      // const payload = action.payload;
      // const updatedCategoryInfo = [];
      // const categoryInfo = action.payload.currentPage === '1' ? [] : Object.assign([], state.categoryInfo)
      // const categoryItemsInfo = payload.categoryItemsInfo ? payload.categoryItemsInfo : []
      // const foundCategories = [];
      // if (categoryInfo && categoryInfo.length > 0) {
      //   categoryInfo.forEach((categoryItem, index) => {
      //     let currentItemsArr = undefined;
      //     categoryItemsInfo && categoryItemsInfo.length && categoryItemsInfo.map((item, index) => {
      //       if (item.categoryName && (item.categoryName === categoryItem.categoryName)) {
      //         currentItemsArr = item.itemInfo
      //         foundCategories.push(item.categoryName);
      //       }
      //       return null;
      //     })
      //     const items = categoryItem ? categoryItem : { itemInfo: [] }
      //     items.itemInfo = currentItemsArr ? [...currentItemsArr, ...items.itemInfo] : items.itemInfo
      //     updatedCategoryInfo.push(items)
      //   })
      // }
      // if (categoryItemsInfo && categoryItemsInfo.length > 0) {
      //   categoryItemsInfo.forEach((item) => {
      //     const catName = item.categoryName;
      //     if (foundCategories.indexOf(catName) === -1) {
      //       updatedCategoryInfo.push(item);
      //     }
      //   });
      // }
      return {
        ...state,
        loading: false,
        loaded: true,
        data: {
          ...state.data,
          registeredGiftList: action.payload,
        },
        //categoryInfo: updatedCategoryInfo,
        quantitysuccess: false,
        favouritesuccess: false,
        error: null,
        eventDataFailed: false,
        extraData: 'This is extra info..........',
      };
    case GET_REGISTERED_GIFT_LIST_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        eventDataFailed: true,
        error: action.error,
      };
    case CHANGE_DELIVERY_ADDRESS:
      return {
        ...state,
        loading: true,
      };
    case CHANGE_DELIVERY_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: {
          ...state.data,
          registeredGiftList: action.payload,
        },
        // categoryInfo: action.payload.categoryItemsInfo,
        error: null,
        extraData: 'This is extra info..........',
      };
    case CHANGE_DELIVERY_ADDRESS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      };
    case CHANGE_DELIVERY_MODE:

      return {
        ...state,
        loading: true,
      };
    case CHANGE_DELIVERY_MODE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: {
          ...state.data,
          registeredGiftList: action.payload,
        },
        // categoryInfo: action.payload.categoryItemsInfo,
        error: null,
        extraData: 'This is extra info..........',
      };
    case CHANGE_DELIVERY_MODE_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      };
    case REMOVE_GIFT:
      return {
        ...state,
        loading: true,
      };
    case REMOVE_GIFT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: {
          ...state.data,
          registeredGiftList: action.payload,
        },
        // categoryInfo: action.payload.categoryItemsInfo,
        error: null,
        extraData: 'This is extra info..........',
      };
    case SAVE_QUANTITY:
      return {
        ...state,
        loading: true,
      };
    case SAVE_QUANTITY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        quantitysuccess: action.payload.status,
        error: null,
        extraData: 'This is extra info..........',
      };
    case SAVE_QUANTITY_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
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
