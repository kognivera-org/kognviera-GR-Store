//import 'babel-polyfill'
import axios from 'axios';
import API_MAP from '../../endpoints';
import commonUtil from '../../utils/commonUtil';


export function clearSearch() {
    return async (dispatch) => {
        try {
            // dispatch pending
            dispatch({ type: 'CLEAR_SEARCH', payload: {} })

        } catch (e) {
            console.log('error :: ', e);
        }
    }
}

export function getInitiateReturnList(values, eventId, sessionInvalidate) {
    const _values = {
        sessionInvalidate,
        eventId: eventId,
        initiateReturnList: [...values],
    };
    return {
        types: ['INITIATE_RETURN_LIST', 'INITIATE_RETURN_LIST_SUCCESS', 'INITIATE_RETURN_LIST_FAILURE'],
        ping: client => client.post(API_MAP.get_initiate_return_list, {
            data: { ..._values },
        }),
    };
}


// export function deleteInvalidReturnItem(values) {
//     const _values = {
//         skuId: values
//     };
//     return {
//         type: 'DELETE_INVALID_RETURN_LIST',
//         payload: { ..._values },
//     };
// }

export function deleteReturnItem(values) {
    const _values = {
        purchaseItemId: values
    };
    return {
        types: ['DELETE_RETURN_LIST', 'DELETE_RETURN_LIST_SUCCESS', 'DELETE_RETURN_LIST_FAILURE'],
        ping: client => client.post(API_MAP.delete_return_item, {
            data: { ..._values },
        }),
    };
}

// export function deleteInvalidReturnItem(values) {
//     const _values = {
//         skuId: values
//     };
//     return {
//         type: 'DELETE_RETURN_INVALID_SKU'
//     };
// }