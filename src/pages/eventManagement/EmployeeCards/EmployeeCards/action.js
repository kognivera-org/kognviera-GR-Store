import 'babel-polyfill';
import axios from 'axios';
import API_MAP from '../../../../endpoints';

export function getEmployeeCardDetails(eventId) {
    return {
        types: ['GET_EMPLOYEE_CARD', 'GET_EMPLOYEE_CARD_SUCCESS', 'GET_EMPLOYEE_CARD_FAILURE'],
        ping: client => client.post(API_MAP.get_employee_dilisa_card_details, {
            data: {
                eventId: eventId,
            }
        })
    }
}
