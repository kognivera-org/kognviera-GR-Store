import axios from 'axios';
import API_MAP from 'endpoints';


export function updateAddress(values, addressId) {
    values.addressId = addressId
    return {
        types: ['UPDATE_ADDRESS', 'UPDATE_ADDRESS_SUCCESS', 'UPDATE_ADDRESS_FAILURE'],
        ping: client => client.post(API_MAP.update_address_url, {
            data: { ...values },
        }),
    }
}