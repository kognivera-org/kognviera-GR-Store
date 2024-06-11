let initialState = {
    data: {},
    eventCategories: {},
    error: {}
};
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'EVENT_CATEGORIES':
            return {
                ...state,
                eventCategories: {}
            };
        case 'EVENT_CATEGORIES_SUCCESS':
            return {
                ...state,
                eventCategories: action.payload
            };
        case 'EVENT_CATEGORIES_FAILURE':
            return {
                ...state,
                eventCategories: {}
            };
        case 'EDIT_EVENT':
            return {
                ...state,
            }
        case 'EDIT_EVENT_SUCCESS':
            return {
                ...state,
                data: action.payload,
                error: undefined
            }
        case 'EDIT_EVENT_FAILURE':
            return {
                ...state,
                error: action.payload
            }
        case 'EDIT_EVENT_NAME':
            return {

                ...state,
            }
        case 'EDIT_EVENT_NAME_SUCCESS':
            return {
                ...state,
                eventNameData: action.payload,
                error: undefined
            }
        case 'EDIT_EVENT_NAME_FAILURE':
            return {
                ...state,
                error: action.payload
            }
        case 'SET_EVENT_DATE':
            return {
                ...state,
            }
        case 'SET_EVENT_DATE_SUCCESS':
            return {
                ...state,
                eventNameData: action.payload,
                setEventDateSuccess: true,
                error: undefined
            }
        case 'SET_EVENT_DATE_FAILURE':
            return {
                ...state,
                error: action.payload
            }
        case 'DELETE_ADMINISTRATOR':

            return {
                ...state,
            }
        case 'DELETE_ADMINISTRATOR_SUCCESS':

            return {
                ...state,
                data: action.payload,
                error: undefined
            }
        case 'DELETE_ADMINISTRATOR_FAILURE':

            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}


