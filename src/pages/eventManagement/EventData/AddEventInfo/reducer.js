let initialState = {
    data: {},
    error: {},
    loading: false,
    addingEventInfo: false
};
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_EVENT_INFO':
            return {
                ...state,
                addingEventInfo: true,
                addEventInfoSuccess: false,
            }
        case 'ADD_EVENT_INFO_SUCCESS':
            return {
                ...state,
                data: action.payload,
                addingEventInfo: false,
                addEventInfoSuccess: true,
                error: undefined
            }
        case 'ADD_EVENT_INFO_FAILURE':
            return {
                ...state,
                error: action.payload,
                addingEventInfo: false,
                addEventInfoSuccess: false,
            }
        default:
            return state;
    }
}

