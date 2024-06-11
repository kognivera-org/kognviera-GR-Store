

export const GET_PERSONAL_SHOPPING_GIFT_LIST = 'GET_PERSONAL_SHOPPING_GIFT_LIST'
export const GET_PERSONAL_SHOPPING_GIFT_LIST_SUCCESS = 'GET_PERSONAL_SHOPPING_GIFT_LIST_SUCCESS'
export const GET_PERSONAL_SHOPPING_GIFT_LIST_FAIL = 'GET_PERSONAL_SHOPPING_GIFT_LIST_FAIL'

export const UPDATE_BONUS_SELECTION = 'UPDATE_BONUS_SELECTION'
export const UPDATE_BONUS_SELECTION_SUCCESS = 'UPDATE_BONUS_SELECTION_SUCCESS'
export const UPDATE_BONUS_SELECTION_FAIL = 'UPDATE_BONUS_SELECTION_FAIL'

// Received List

export function getPersonalShoppingGiftList(params) {
    return {
        types: [GET_PERSONAL_SHOPPING_GIFT_LIST, GET_PERSONAL_SHOPPING_GIFT_LIST_SUCCESS, GET_PERSONAL_SHOPPING_GIFT_LIST_FAIL],
        ping: client => client.post('/api/getComprasPersonales', {
            data: { ...params },
        }),

    }
}

export function updateBonusInfo(params) {
    return {
        types: [UPDATE_BONUS_SELECTION, UPDATE_BONUS_SELECTION_SUCCESS, UPDATE_BONUS_SELECTION_FAIL],
        ping: client => client.post('/api/updateBonusSelection', {
            data: { ...params },
        }),

    }
}

