import 'babel-polyfill'
import axios from 'axios'
import API_MAP from '../../../../endpoints'

export function preferredDeliveryDayDetails(postalCodes, preferredDeliveryDayOpted) {
    return {
        types: ['PREFFERED_DELIVERY_DAYS', 'PREFFERED_DELIVERY_DAYS_SUCCESS', 'PREFFERED_DELIVERY_DAYS_FAILURE'],
        ping: client => client.post(API_MAP.delivery_preference, {
            data: {
                postalCode: postalCodes,
                preferredDeliveryDayOpted: preferredDeliveryDayOpted
            }
        })

    }
}

export function getDeliveryDetails() {
    return {
        types: ['GETDELIVERYDETAILS', 'GETDELIVERYDETAILS_SUCCESS', 'GETDELIVERYDETAILS_FAILURE'],
        ping: client => client.post(API_MAP.get_addresses_url, {
            data: {
                profileId: "12345",
            }
        })

    }
}

