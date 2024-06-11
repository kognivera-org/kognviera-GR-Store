import axios from 'axios'
import API_MAP from 'endpoints'
import { EVENTDETAIL, EVENTDETAIL_SUCCESS, EVENTDETAIL_FAIL, ACCOUNTTRANSFER, ACCOUNTTRANSFER_SUCCESS, ACCOUNTTRANSFER_FAIL } from '../../../../eventManagement/EventDashboard/actions';
import { ACCOUNTSTATEMENT_DETAILS, ACCOUNTSTATEMENT_DETAILS_SUCCESS, ACCOUNTSTATEMENT_DETAILS_FAIL } from '../../../../accountSummary/actions'

export function getDisplayEventStatusDropdown(params) {
    return {
        types: ['DISPLAYEVENTSTATUSDROPDOWN', 'DISPLAYEVENTSTATUSDROPDOWN_SUCCESS', 'DISPLAYEVENTSTATUSDROPDOWN_FAILURE'],
        ping: client => client.post(API_MAP.display_event_status, {
            data: params
        })
    }
}

export function changeEventStatus(params, profileId) {
    return [{
        types: ['CHANGEEVENTSTATUS', 'CHANGEEVENTSTATUS_SUCCESS', 'CHANGEEVENTSTATUS_FAILURE'],
        ping: client => client.post(API_MAP.change_event_status, {
            data: params
        })
    }, {
        types: [EVENTDETAIL, EVENTDETAIL_SUCCESS, EVENTDETAIL_FAIL],
        ping: client => client.post(API_MAP.get_details, {
            data: {
                eventId: params.eventId,
                profileId: profileId
            },
        }),
    }]
}

export function changeEmployeeEvent(eventId, isChecked, profileId) {
    const queryString = {
        employeeEventFlag: isChecked,
        eventId,
    }
    return [{
        types: ['CHANGE_EMPLOYEE_EVENT', 'CHANGE_EMPLOYEE_EVENT_SUCCESS', 'CHANGE_EMPLOYEE_EVENT_FAILURE'],
        ping: client => client.post(API_MAP.change_employee_event, {
            data: {
                employeeEventFlag: isChecked,
                eventId,
            },
        })
    }, {
        types: [EVENTDETAIL, EVENTDETAIL_SUCCESS, EVENTDETAIL_FAIL],
        ping: client => client.post(API_MAP.get_details, {
            data: {
                eventId,
                profileId: profileId
            },
        }),
    }, {
        types: [ACCOUNTSTATEMENT_DETAILS, ACCOUNTSTATEMENT_DETAILS_SUCCESS, ACCOUNTSTATEMENT_DETAILS_FAIL],
        ping: client => client.post(API_MAP.getEventAccountStatementDetails, {
            data: { eventId },
        }),
    },
    {
        types: [ACCOUNTTRANSFER, ACCOUNTTRANSFER_SUCCESS, ACCOUNTTRANSFER_FAIL],
        ping: client => client.post('/api/getAccountPartialTransferDetails', {
            data: {
                "eventId": eventId
            },
        }),
    }
    ]
}