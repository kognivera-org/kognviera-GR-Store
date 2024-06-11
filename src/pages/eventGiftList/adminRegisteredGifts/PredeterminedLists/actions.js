// import commonUtil from '../../../../utils/commonUtil';
import API_MAP from '../../../../../src/endpoints'

export const GET_PREDETERMINED_LANDING_PAGE_LOAD = 'GET_PREDETERMINED_LANDING_PAGE_LOAD'
export const GET_PREDETERMINED_LANDING_PAGE_LOAD_SUCCESS = 'GET_PREDETERMINED_LANDING_PAGE_LOAD_SUCCESS'
export const GET_PREDETERMINED_LANDING_PAGE_LOAD_FAIL = 'GET_PREDETERMINED_LANDING_PAGE_LOAD_FAIL'

export const ADD_PREDETERMINED_ITEM_LOAD = 'ADD_PREDETERMINED_ITEM_LOAD'
export const ADD_PREDETERMINED_ITEM_LOAD_SUCCESS = 'ADD_PREDETERMINED_ITEM_LOAD_SUCCESS'
export const ADD_PREDETERMINED_ITEM_LOAD_FAIL = 'ADD_PREDETERMINED_ITEM_LOAD_FAIL'

export const PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD = 'PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD'
export const PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD_SUCCESS = 'PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD_SUCCESS'
export const PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD_FAIL = 'PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD_FAIL'

export const PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD = 'PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD'
export const PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD_SUCCESS = 'PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD_SUCCESS'
export const PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD_FAIL = 'PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD_FAIL'


export function getpredeterminedLandingPageLoaded(globalState) {
  return globalState.predeterminedLists.predeterminedLandingPage && globalState.predefinedLists.predeterminedLandingPage.loaded
}

// Actual services
export function getpredeterminedLandingPage(brand, eventType) {
  const _labelInput = {}
  _labelInput.brand = brand
  // _labelInput.channel = 'INSTORE'// commonUtil.getChannel();
  _labelInput.eventType = eventType
  return {
    types: [GET_PREDETERMINED_LANDING_PAGE_LOAD, GET_PREDETERMINED_LANDING_PAGE_LOAD_SUCCESS, GET_PREDETERMINED_LANDING_PAGE_LOAD_FAIL],
    // promise: client => client.get('/api/registeredGiftList'), // params not used, just shown as demonstration
    ping: client => client.post('/api/predeterminedLandingPage', {
      data: (_labelInput),
    }),
  }
}

export function getaddPredeterminedItemLoaded(globalState) {
  return globalState.predeterminedLists.addPredeterminedItem && globalState.predeterminedLists.addPredeterminedItem.loaded
}

// Actual service
// export function getaddPredeterminedItem(brand, repoId, eventId) {
//   const _labelInput = {}


//   // _labelInput.brand = brand// commonUtil.getBrand();
//   // _labelInput.channel = 'INSTORE'// commonUtil.getChannel();
//   _labelInput.predeterminedItemId = repoId
//   _labelInput.eventId = eventId
//   _labelInput.brand = brand
//   // _labelInput.itemId = repoId;
//   return {
//     types: [ADD_PREDETERMINED_ITEM_LOAD, ADD_PREDETERMINED_ITEM_LOAD_SUCCESS, ADD_PREDETERMINED_ITEM_LOAD_FAIL],
//     // promise: client => client.get('/api/registeredGiftList'), // params not used, just shown as demonstration
//     ping: client => client.post('/api/addPredeterminedItem', {
//       data: (_labelInput),
//     }),
//   }
// }

export function getpredeterminedListPageHeaderInfoLoaded(globalState) {
  return globalState.predeterminedLists.predeterminedListPageHeaderInfo && globalState.predeterminedLists.predeterminedListPageHeaderInfo.loaded
}

export function getpredeterminedListPageHeaderInfo(brand, repoId) {
  // const _labelInput = {};
  // _labelInput.predeterminedListId = '34654654';
  // _labelInput.channel = 'WEB';// commonUtil.getChannel();

  const _getPredeterminedHeaderInfo = {}
  _getPredeterminedHeaderInfo.brand = brand
  // _getPredeterminedHeaderInfo.channel = 'INSTORE'
  _getPredeterminedHeaderInfo.predeterminedListId = repoId
  return {
    types: [PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD, PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD_SUCCESS, PREDETERMINED_LIST_PAGE_HEADER_INFO_LOAD_FAIL],
    ping: client => client.post(API_MAP.get_predetermined_list_header, {
      data: (_getPredeterminedHeaderInfo),
    }),
  }
}
export function getPredeterminedListPageItemsInfoLoaded(globalState) {
  return globalState.predeterminedLists.PredeterminedListPageItemsInfo && globalState.predeterminedLists.PredeterminedListPageItemsInfo.loaded
}

export function getPredeterminedListPageItemsInfo(brand, repoId, currentPage, categoryId, priceOrder) {
  const _labelInput = {}
  _labelInput.predeterminedListId = repoId
  _labelInput.currentPage = currentPage
  // _labelInput.channel = 'INSTORE'
  _labelInput.brand = brand
  if (categoryId) {
    _labelInput.categoryId = categoryId
  }
  if (priceOrder) {
    _labelInput.priceOrder = priceOrder
  }
  return {
    types: [PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD, PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD_SUCCESS, PREDETERMINED_LIST_PAGE_ITEMS_INFO_LOAD_FAIL],
    // promise: client => client.get('/api/registeredGiftList'), // params not used, just shown as demonstration
    ping: client => client.post('/api/predeterminedListPageItemsInfo', {
      data: (_labelInput),
    }),
  }
}

export const getFilteredResult = guidedFuilteredProducts => (dispatch) => {
  dispatch(guidedFuilteredProducts)
}
export const getProductPerPage = (products, noOfProductPerPage) => (dispatch) => {
  const productPerPage = []
  if (products) {
    for (let i = 0; i < products.length; i++) {
      if (i % noOfProductPerPage === 0) {
        productPerPage.push([products[i]])
      } else {
        productPerPage[productPerPage.length - 1].push(products[i])
      }
    }
  }
  dispatch(productPerPage, products)
}
