import 'babel-polyfill'
import axios from 'axios'
import API_MAP from '../../../../endpoints'


export function getContractDetails(eventType, isEmployee, eventId, eventDate) {
    return {
        types: ['GETCONTRACTDETAILS', 'GETCONTRACTDETAILS_SUCCESS', 'GETCONTRACTDETAILS_FAILURE'],
        ping: client => client.post(API_MAP.get_contract_details, {
            data: {
                eventId,
                eventType,
                isEmployee,
                eventDate
            },
        }),

    }
}

