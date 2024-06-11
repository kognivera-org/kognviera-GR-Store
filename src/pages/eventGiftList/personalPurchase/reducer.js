import { GET_PERSONAL_SHOPPING_GIFT_LIST, GET_PERSONAL_SHOPPING_GIFT_LIST_SUCCESS, GET_PERSONAL_SHOPPING_GIFT_LIST_FAIL, UPDATE_BONUS_SELECTION_SUCCESS, UPDATE_BONUS_SELECTION_FAIL, UPDATE_BONUS_SELECTION } from './action'
const initialState = {
    eventDataLoading: true,
    eventData: {},
    eventDataFailed: false,
    itemsInfo: [],
}
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case GET_PERSONAL_SHOPPING_GIFT_LIST:
            return {
                ...state,
                eventDataLoading: true,
                eventDataFailed: false
            }
        case GET_PERSONAL_SHOPPING_GIFT_LIST_SUCCESS:
            //const itemsInfo = action.payload && action.payload.currentPage === '1' ? action.payload.itemsInfo : [...state.itemsInfo, ...action.payload.itemsInfo]
            return {
                ...state,
                eventDataLoading: false,
                eventData: action.payload,
                //itemsInfo: itemsInfo
            }
        case GET_PERSONAL_SHOPPING_GIFT_LIST_FAIL:
            return {
                ...state,
                eventDataLoading: false,
                eventDataFailed: true,
            }

        case UPDATE_BONUS_SELECTION:
            return {
                ...state,
                bonusDataLoading: true,
                bonusData: true,
            }
        case UPDATE_BONUS_SELECTION_SUCCESS:
            return {
                ...state,
                bonusDataLoading: false,
                bonusData: action.payload,
            }
        case UPDATE_BONUS_SELECTION_FAIL:
            return {
                ...state,
                bonusDataLoading: false,
                bonusDataFailed: true,
            }
        default:
            return state
    }
}
