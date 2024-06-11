import API_MAP from '../../../../endpoints'
import axios from 'axios'
import 'babel-polyfill'
import { executeEventDetail } from '../../EventDashboard/actions'


export function getEditEventInfo(values) {
    let Channel = 'INSTORE';
    let Brand = 'LP';
    return {
        types: ['EDIT_EVENT', 'EDIT_EVENT_SUCCESS', 'EDIT_EVENT_FAILURE'],
        ping: client => client.post(API_MAP.get_edit_event, {
            data: {
                // "channel": "WEB",
                // "brand": "LP",
                "eventId": "1234",
                "profileId": "12345678"
            }
        })
    }
}

export function getEventCategoryDetails() {
    return {
        types: ['EVENT_CATEGORIES', 'EVENT_CATEGORIES_SUCCESS', 'EVENT_CATEGORIES_FAILURE'],
        ping: client => client.post(API_MAP.get_event_categories, {
            data: {
                "channel": "INSTORE",
                "brand": "LP",
            }
        })
    }
}

export function editEventName(values, emails) {
    return [{
        types: ['VALIDATE_EVENT_NAME', 'VALIDATE_EVENT_NAME_SUCCESS', 'VALIDATE_EVENT_NAME_FAILURE'],
        ping: client => client.post(API_MAP.validate_event_name, {
            data: {
                eventName: values.editNameEvent,
                ownerEmail: emails.ownerEmail,
                coOwnerEmail: emails.coOwnerEmail,
                eventDate: values.eventDate,
            }
        })
    }, {
        types: ['EDIT_EVENT_NAME', 'EDIT_EVENT_NAME_SUCCESS', 'EDIT_EVENT_NAME_FAILURE'],
        ping: client => client.post(API_MAP.edit_event_name, {
            data: {
                eventId: values.eventId,
                eventName: values.editNameEvent,
            }
        })
    }, {
        types: ['eventdetails/EVENTDETAIL', 'eventdetails/EVENTDETAIL_SUCCESS', 'eventdetails/EVENTDETAIL_FAIL'],
        ping: client => client.post(API_MAP.get_details, {
            data: {
                eventId: values.eventId,
                profileId: values.profileId
            },
        }),
    }]
}

export function setEventDate(values) {
    // return {
    //     types: ['SET_EVENT_DATE', 'SET_EVENT_DATE_SUCCESS', 'SET_EVENT_DATE_FAILURE'],
    //     ping: client => client.post(API_MAP.set_event_date, {
    //         data: {
    //             channel: values.channel,
    //             brand: values.brand,
    //             eventId: values.eventId,
    //             selectedEventDate: values.selectedEventDate

    //         }
    //     })
    // }
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_EVENT_DATE' });
            const response = await axios.post(API_MAP.set_event_date, {
                channel: values.channel,
                brand: values.brand,
                eventId: values.eventId,
                selectedEventDate: values.selectedEventDate
            });
            const status = response.data.status;
            // business logic according to payload
            if (status && status.status && status.status.toLowerCase() === 'success') {
                dispatch(executeEventDetail(values.eventId, values.profileId));
            }
        } catch (e) {

            dispatch({ type: 'SET_EVENT_DATE_FAILURE', payload: e });
        }
    }
}

export function deleteAdministrator(values) {

    return async (dispatch) => {
        try {
            dispatch({ type: 'DELETE_ADMINISTRATOR' });
            const response = await axios.post(API_MAP.delete_administrator, {
                channel: values.channel,
                brand: values.brand,
                eventId: values.eventId,
                ownerId: values.ownerId,
            });
            const status = response.data.status;
            // business logic according to payload
            if (status && status.status && status.status.toLowerCase() === 'success') {
                dispatch(executeEventDetail(values.eventId, values.profileId));
                dispatch({ type: 'DELETE_ADMINISTRATOR_SUCCESS', payload: response.data });
            } else {
                dispatch({ type: 'DELETE_ADMINISTRATOR_FAILURE', payload: response.data });
            }
        } catch (e) {

            dispatch({ type: 'DELETE_ADMINISTRATOR_FAILURE', payload: e });
        }
    };
}
