import API_MAP from '../../../../endpoints'
import axios from 'axios'
import 'babel-polyfill'
import { executeEventDetail } from '../../EventDashboard/actions'

export function addEventInfoFailure(response) {
    return async (dispatch) => {
        dispatch({ type: 'ADD_EVENT_INFO_FAILURE', payload: response.data });
    }
}
// export function addEventInfo(response) {
//     return async (dispatch) => {
//         dispatch({ type: 'ADD_EVENT_INFO_SUCCESS', payload: response.data });
//     };
// }

export function addEventInfo(response) {
    return async (dispatch) => {
        dispatch({ type: 'ADD_EVENT_INFO' })
        dispatch({ type: 'ADD_EVENT_INFO_SUCCESS', payload: response.data })
    }
}

// export function addEventInfo(response) {
//     return {
//         types: ['ADD_EVENT_INFO', 'ADD_EVENT_INFO_SUCCESS'],
//         ping: client => client.post(API_MAP.get_delivery_addresses_url, {
//             data: {
//                 // brand: 'LP',
//                 // channel: 'INSTORE',
//                 eventId: eventId
//             }
//         })
//     }
// }