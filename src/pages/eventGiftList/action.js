import API_MAP from '../../endpoints';

export const GET_REGISTERED_GIFT_LIST = 'GET_REGISTERED_GIFT_LIST';
export const GET_REGISTERED_GIFT_LIST_SUCCESS = 'GET_REGISTERED_GIFT_LIST_SUCCESS';
export const GET_REGISTERED_GIFT_LIST_FAIL = 'GET_REGISTERED_GIFT_LIST_FAIL';

export const CHANGE_DELIVERY_ADDRESS = 'CHANGE_DELIVERY_ADDRESS';
export const CHANGE_DELIVERY_ADDRESS_SUCCESS = 'CHANGE_DELIVERY_ADDRESS_SUCCESS';
export const CHANGE_DELIVERY_ADDRESS_FAIL = 'CHANGE_DELIVERY_ADDRESS_FAIL';

export const CHANGE_DELIVERY_MODE = 'CHANGE_DELIVERY_MODE';
export const CHANGE_DELIVERY_MODE_SUCCESS = 'CHANGE_DELIVERY_MODE_SUCCESS';
export const CHANGE_DELIVERY_MODE_FAIL = 'CHANGE_DELIVERY_MODE_FAIL';

export const ADD_GIFT_ITEM_SKUID = 'ADD_GIFT_ITEM_SKUID';
export const ADD_GIFT_ITEM_SKUID_SUCCESS = 'ADD_GIFT_ITEM_SKUID_SUCCESS';
export const ADD_GIFT_ITEM_SKUID_FAIL = 'ADD_GIFT_ITEM_SKUID_FAIL';

export const REMOVE_GIFT = 'REMOVE_GIFT';
export const REMOVE_GIFT_SUCCESS = 'REMOVE_GIFT_SUCCESS';
export const REMOVE_GIFT_FAILURE = 'REMOVE_GIFT_FAILURE';

export const SAVE_QUANTITY = 'SAVE_QUANTITY';
export const SAVE_QUANTITY_SUCCESS = 'SAVE_QUANTITY_SUCCESS';
export const SAVE_QUANTITY_FAIL = 'SAVE_QUANTITY_FAIL';

export const SET_FAVOURITE = 'SET_FAVOURITE';
export const SET_FAVOURITE_SUCCESS = 'SET_FAVOURITE_SUCCESS';
export const SET_FAVOURITE_FAIL = 'SET_FAVOURITE_FAIL';
export const FETCH_BRAND = 'FETCH_BRAND';

export function getRegisteredGiftList(params, search, priceOrder, isShowAll) {
    const _registeredGifts = {}
    _registeredGifts.brand = params.brand
    // _registeredGifts.channel = params.channel
    _registeredGifts.eventId = params.eventId
    _registeredGifts.currentPage = params.currentPage ? params.currentPage : 1
    _registeredGifts.priceOrder = priceOrder
    _registeredGifts.priceOrderCategory = params.priceOrderCategory
    _registeredGifts.isShowAll = isShowAll
    if (search && search.trim()) {
        _registeredGifts.searchKeyword = search
    }
    return {
        types: [GET_REGISTERED_GIFT_LIST, GET_REGISTERED_GIFT_LIST_SUCCESS, GET_REGISTERED_GIFT_LIST_FAIL],
        ping: client => client.post(API_MAP.get_registered_giftList, {
            data: (_registeredGifts),
        }),
    }
}

export function changeDeliveryAdressAction(params) {
    return {
        types: ['CHANGE_DELIVERY_ADDRESS', 'CHANGE_DELIVERY_ADDRESS_SUCCESS', 'CHANGE_DELIVERY_ADDRESS_FAIL'],
        ping: client => client.post(API_MAP.change_delivery_address, {
            data: (params),
        }),
    }
}

export function changeDeliveryModeAction(params) {
    return {
        types: [CHANGE_DELIVERY_MODE, CHANGE_DELIVERY_MODE_SUCCESS, CHANGE_DELIVERY_MODE_FAIL],
        ping: client => client.post(API_MAP.change_delivery_mode, {
            data: (params),
        }),
    }
}

export function removeGiftList(params) {
    return {
        types: [REMOVE_GIFT, REMOVE_GIFT_SUCCESS, REMOVE_GIFT_FAILURE],
        ping: client => client.post(API_MAP.remove_gift, {
            data: (params),
        }),
    };
}

export function saveQuantityAction(params, giftItemId, skuId, quantity) {
    const _saveQuantity = {};
    _saveQuantity.brand = params.brand;
    // _saveQuantity.channel = params.channel;
    _saveQuantity.eventId = params.eventId;
    _saveQuantity.giftItemId = giftItemId;
    _saveQuantity.skuId = skuId;
    _saveQuantity.quantity = quantity;
    return {
        types: [SAVE_QUANTITY, SAVE_QUANTITY_SUCCESS, SAVE_QUANTITY_FAIL],
        ping: client => client.post(API_MAP.save_quantity, {
            data: (_saveQuantity),
        })
    };
}

export function setFavouriteGiftAction(params, giftItemId, skuId, isFavourite) {
    const _setFavourite = {};
    _setFavourite.brand = params.brand;
    // _setFavourite.channel = params.channel;
    _setFavourite.eventId = params.eventId;
    _setFavourite.giftItemId = giftItemId;
    _setFavourite.skuId = skuId;
    _setFavourite.isFavourite = isFavourite;
    return {
        types: [SET_FAVOURITE, SET_FAVOURITE_SUCCESS, SET_FAVOURITE_FAIL],
        ping: client => client.post(API_MAP.set_favourite, {
            data: (_setFavourite),
        })
    };
}

export function saveBrand(brand) {
    return {
        type: FETCH_BRAND,
        payload: brand
    };
}