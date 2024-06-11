import axios from 'axios';
import API_MAP from 'endpoints';

export function getEventDeliveryAddresses(eventId) {
    return {
        types: ['GETEVENTDELIVERYADDRESSES', 'GETEVENTDELIVERYADDRESSES_SUCCESS', 'GETEVENTDELIVERYADDRESSES_FAILURE'],
        ping: client => client.post(API_MAP.get_delivery_addresses_url, {
            data: {
                // brand: 'LP',
                // channel: 'INSTORE',
                eventId: eventId         //300000021
            }
        })
    }
}

// export function deleteAddress(queryString) {
//     console.log('deleteAddressValues--', queryString)
//     return {
//         types: ['DELETEADDRESS', 'DELETEADDRESS_SUCCESS', 'DELETEADDRESS_FAILURE'],
//         ping: client => client.post(API_MAP.delete_delivery_addresses_url, {
//             data: queryString
//         })
//     }
// }


export function deleteAddress(queryString, eventAddresses) {
    console.log("queryString", queryString)
    console.log("deleteAction dataBeforeDelete", eventAddresses)
    const newEventAddresses = Object.assign([], eventAddresses);
    return async (dispatch) => {
        try {
            dispatch({ type: 'DELETEADDRESS' });
            const response = await axios.post(API_MAP.delete_delivery_addresses_url, {
                channel: queryString.channel,
                brand: queryString.brand,
                eventId: queryString.eventId,
                addressId: queryString.addressId  //this.state.addressToDeleteNickName
            });
            const status = response.data.status;
            if (status && status.status && status.status.toLowerCase() === 'success') {
                console.log("deleteAction success")
                let addressList = eventAddresses.deliveryAddressInfo.addresses;
                const updatedEventAddressList = addressList.filter((eventAdrs => {
                    return eventAdrs.addressId !== queryString.addressId;
                }))
                console.log('updatedEventAddressList', updatedEventAddressList);
                newEventAddresses.deliveryAddressInfo.addresses = updatedEventAddressList;
                console.log('newEventAddresses', newEventAddresses)
                dispatch({ type: 'DELETEADDRESS_SUCCESS', payload: newEventAddresses });
            } else {
                dispatch({ type: 'DELETEADDRESS_FAILURE', payload: response.data.status });
            }
        } catch (e) {
            console.log('error :: ', e);
            dispatch({ type: 'DELETEADDRESS_FAILURE', payload: e });
        }
    };
}


export function assignAddress(queryString, eventId) {
    console.log("queryString", queryString)
    console.log("eventIdeventIdeventIdeventId", eventId)
    return async (dispatch) => {
        try {
            dispatch({ type: 'ASSIGNADDRESS' });
            const response = await axios.post(API_MAP.assign_address_url, {
                addressId1: queryString.addressId1,
                celebrityId1: queryString.celebrityId1,
                addressId2: queryString.addressId2,
                celebrityId2: queryString.celebrityId2,
                addressId3: queryString.addressId3,
                celebrityId3: queryString.celebrityId3,
                eventId: queryString.eventId,
                brand: queryString.brand,
                channel: queryString.channel,
                eventId: queryString.eventId
            });
            const status = response.data.status;
            if (status && status.status && status.status.toLowerCase() === 'success') {
                console.log("ASSIGNADDRESSAction success")
                dispatch({ type: 'ASSIGNADDRESS_SUCCESS', payload: response.data });
            } else {
                dispatch({ type: 'ASSIGNADDRESS_FAILURE', payload: response.data.status });
            }
        } catch (e) {
            console.log('error :: ', e);
            dispatch({ type: 'ASSIGNADDRESS_FAILURE', payload: e });
        }
    };
}


