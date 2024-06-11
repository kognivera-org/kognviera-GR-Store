import axios from 'axios';
import API_MAP from 'endpoints';

export function getStateList(params) {
    let values = params
    if (!values) {
        values = { searchType: 'storeLogin' }
    }
    return {
        types: ['GETSTATES', 'GETSTATES_SUCCESS', 'GETSTATES_FAILURE'],
        ping: client => client.post(API_MAP.get_states_list_url, {
            data: {
                ...values
            }
        })
    }
}

export function getStorelist(params) {
    let values = params
    if (values && !values.searchType) {
        values.searchType = 'storeLogin'
    }
    return {
        types: ['GETSTORES', 'GETSTORES_SUCCESS', 'GETSTORES_FAILURE'],
        ping: client => client.post(API_MAP.get_store_list_url, {
            data: {
                ...values
            }
        })
    }
}

export function saveSelectedStore(storeId) {
    return {
        types: ['SAVE_STORE', 'SAVE_STORE_SUCCESS', 'SAVE_STORE_FAIL'],
        ping: client => client.post(API_MAP.save_store_url, {
            data: {
                storeId: storeId
            }
        })
    }
}