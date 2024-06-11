import API_MAP from '../../../endpoints'

// export const GET_REGISTERED_GIFT_LIST = 'GET_REGISTERED_GIFT_LIST';
// export const GET_REGISTERED_GIFT_LIST_SUCCESS = 'GET_REGISTERED_GIFT_LIST_SUCCESS';
// export const GET_REGISTERED_GIFT_LIST_FAIL = 'GET_REGISTERED_GIFT_LIST_FAIL';

export const GET_GIFT_LIST_GUEST_VIEW = 'GET_GIFT_LIST_GUEST_VIEW'
export const GET_GIFT_LIST_GUEST_VIEW_SUCCESS = 'GET_GIFT_LIST_GUEST_VIEW_SUCCESS'
export const GET_GIFT_LIST_GUEST_VIEW_FAIL = 'GET_GIFT_LIST_GUEST_VIEW_FAIL'

export const SET_FAVOURITE = 'SET_FAVOURITE'
export const SET_FAVOURITE_SUCCESS = 'SET_FAVOURITE_SUCCESS'
export const SET_FAVOURITE_FAIL = 'SET_FAVOURITE_FAIL'

export function getGiftListGuestView(eventId, currentPage, categoryId, priceOrder, brand, isShowAll) {
  const _giftListGuestView = {}
  _giftListGuestView.brand = brand
  // _giftListGuestView.channel = 'INSTORE'
  _giftListGuestView.eventId = eventId
  _giftListGuestView.currentPage = currentPage
  if (categoryId) {
    _giftListGuestView.categoryId = categoryId
  }
  if (priceOrder) {
    _giftListGuestView.priceOrder = priceOrder
  }

  if (isShowAll) {
    _giftListGuestView.isShowAll = isShowAll
  }
  //   if (search && search.trim()) {
  //     console.log('searcghhhhhhhhhhhhhhhhhh');
  //     _registeredGifts.searchKeyword = search;
  //   }
  return {
    types: [GET_GIFT_LIST_GUEST_VIEW, GET_GIFT_LIST_GUEST_VIEW_SUCCESS, GET_GIFT_LIST_GUEST_VIEW_FAIL],
    ping: client => client.post(API_MAP.get_event_details, {
      data: (_giftListGuestView),
    }),
  }
}

export function setFavouriteGiftAction(eventId, giftItemId, skuId, isFavourite) {
  const _setFavourite = {}
  // _setFavourite.brand = 'LP'
  // _setFavourite.channel = 'INSTORE'
  _setFavourite.eventId = eventId
  _setFavourite.giftItemId = giftItemId
  _setFavourite.skuId = skuId
  _setFavourite.isFavourite = isFavourite
  return {
    types: [SET_FAVOURITE, SET_FAVOURITE_SUCCESS, SET_FAVOURITE_FAIL],
    ping: client => client.post(API_MAP.set_favourite, {
      data: (_setFavourite),
    }),
  }
}
