const initialState = {
    loading: false,
    data: {},
    error: {},
    //changeStatusSuccess: false,
    changeEmployeeData: {},
};
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case 'DISPLAYEVENTSTATUSDROPDOWN':
            return {
                ...state,
                loading: true,
                changeStatusSuccess: false,
            };

        case 'DISPLAYEVENTSTATUSDROPDOWN_SUCCESS':
            return {
                ...state,
                loading: false,
                eventDisplayStatus: action.payload,
                changeStatusSuccess: false,
                error: undefined
            };

        case 'DISPLAYEVENTSTATUSDROPDOWN_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'CHANGEEVENTSTATUS':
            return {
                ...state,
                loading: true,
                changeStatusSuccess: false,
            };

        case 'CHANGEEVENTSTATUS_SUCCESS':
            return {
                ...state,
                loading: false,
                changeStatusSuccess: true,
                error: undefined
            };

        case 'CHANGEEVENTSTATUS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                changeStatusSuccess: false,
            };

        case 'CHANGE_EMPLOYEE_EVENT':
            return {
                ...state,
                loading: true,
                employeeChanged: false,
            };
        case 'CHANGE_EMPLOYEE_EVENT_SUCCESS':
            return {
                ...state,
                loading: false,
                changeEmployeeData: action.payload,
                employeeChanged: true,
                changeEmployeeError: undefined
            };

        case 'CHANGE_EMPLOYEE_EVENT_FAILURE':
            return {
                ...state,
                loading: false,
                changeEmployeeError: action.payload,
                employeeChanged: false,
            };
        default: return state;
    }
}