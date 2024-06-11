let initialState = {
    data: {},
    error: {},
    loading: false,
    editEventSuccess: false
};
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'SAVE_EDIT_EVENT':

            return {
                ...state,
                editEventSuccess: false,
                error: {}
            }
        case 'SAVE_EDIT_EVENT_SUCCESS':

            return {
                ...state,
                data: action.payload,
                editEventSuccess: true,
                error: {}
            }
        case 'SAVE_EDIT_EVENT_FAILURE':

            return {
                ...state,
                data: {},
                error: action.payload
            }
        case 'VALIDATE_EMAIL':

            return {
                ...state,
                error: {}
            }
        case 'VALIDATE_EMAIL_SUCCESS':
            return {
                ...state,
                validateEmaildata: action.payload,
                emailvalidationSuccess: true,
                error: {}
            }
        case 'VALIDATE_EMAIL_FAILURE':
            return {
                ...state,
                error: action.payload
            }
        case 'CLEAR_VALIDATE_EMAIL':
            return {
                ...state,
                validateEmaildata: {},
                emailvalidationSuccess: false,
                error: {}
            }
        case 'EDIT_CREATE_COOWNER':
            return {
                ...state,
            }
        case 'EDIT_CREATE_COOWNER_SUCCESS':
            return {
                ...state,
                coownerCreated: true,
                ...state.eventData,
                coOwnerData: action.payload,
            }
        case 'EDIT_CREATE_COOWNER_FAILURE':
            return {
                ...state,
                error: action.payload
            }
        case 'CLEAR_SAVEEDITEVENT':
            return {
                ...state,
                editEventSuccess: false,
                coownerCreated: false,
                error: {},
            }

        case 'CLEAR_COOWNERCREATED':
            return {
                ...state,
                coownerCreated: false,
                error: {},
                coOwnerData: {},
            }

        default:
            return state;
    }
}

