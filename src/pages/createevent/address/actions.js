import 'babel-polyfill'
import axios from 'axios'
import API_MAP from '../../../endpoints'
import errorHandler from '../../../pages/global/errorHandler'


export function addAddress(values) {
    values.businessPhoneCode = '';
    values.businessPhoneNumber = '';
    values.particularPhoneCode = '';
    return {
        types: ['ADD_ADDRESS', 'ADD_ADDRESS_SUCCESS', 'ADD_ADDRESS_FAILURE'],
        ping: client => client.post(API_MAP.add_address_url, {
            data: { ...values },
        }),
    }
}

export function updateAddress(values, addressId) {
    values.addressId = addressId
    values.businessPhoneCode = '';
    values.businessPhoneNumber = '';
    values.particularPhoneCode = '';
    return {
        types: ['UPDATE_ADDRESS', 'UPDATE_ADDRESS_SUCCESS', 'UPDATE_ADDRESS_FAILURE'],
        ping: client => client.post(API_MAP.update_address_url, {
            data: { ...values },
        }),
    }
}

export function getAdressSearch(cp) {
    return {
        types: ['GETADDRESSSEARCH', 'GETADDRESSSEARCH_SUCCESS', 'GETADDRESSSEARCH_FAILURE'],
        ping: client => client.post(API_MAP.get_adress_search, {
            data: {
                action: cp.action,
                idEstado: cp.idEstado,
                idMunicipio: cp.idMunicipio,
                //   cp: cp.postalCode,
                cp: cp.cp,
            },
        }),
    }
}

export function fetchOwnerAddresses(profileIds) {
    if (profileIds.length === 1) {
        return {
            types: ['FETCH_OWNER_ADDRESSES', 'FETCH_OWNER_ADDRESSES_SUCCESS', 'FETCH_OWNER_ADDRESSES_FAILURE'],
            ping: client => client.post(API_MAP.get_addresses_url, {
                data: {
                    profileId: profileIds[0],
                },
            }),
        }
    } else {
        return [
            {
                types: ['FETCH_OWNER_ADDRESSES', 'FETCH_OWNER_ADDRESSES_SUCCESS', 'FETCH_OWNER_ADDRESSES_FAILURE'],
                ping: client => client.post(API_MAP.get_addresses_url, {
                    data: {
                        profileId: profileIds[0],
                    },
                }),
            }, {
                types: ['FETCH_OWNER_ADDRESSES', 'FETCH_OWNER_ADDRESSES_SUCCESS', 'FETCH_OWNER_ADDRESSES_FAILURE'],
                ping: client => client.post(API_MAP.get_addresses_url, {
                    data: {
                        profileId: profileIds[1],
                    },
                }),
            }
        ]
    }
}

// export function fetchCoownerAddresses(profileId) {
//     return {
//         types: ['FETCH_COOWNER_ADDRESSES', 'FETCH_COOWNER_ADDRESSES_SUCCESS', 'FETCH_COOWNER_ADDRESSES_FAILURE'],
//         ping: client => client.post(API_MAP.get_addresses_url, {
//             data: {
//                 profileId,
//             },
//         }),
//     }
// }

export function resetAddressList() {
    return async (dispatch) => {
        dispatch({ type: 'RESET_ADDRESS_LIST' })
    }
}

export function flushAddressSearch() {
    return async (dispatch) => {
        dispatch({ type: 'FLUSH_ADDRESS_SEARCH' })
    }
}


