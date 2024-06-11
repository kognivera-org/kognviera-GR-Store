const initialState = {
    loading: true,
    results: {}
}

const EVENTSEARCH_SUCCESS = 'searchevents/EVENTSEARCH_SUCCESS'
const EVENTSEARCH_FAIL = 'searchevents/EVENTSEARCH_FAIL'
const EVENTSEARCH = 'searchevents/EVENTSEARCH'

export default function reducer(state = initialState, action = {}) {

    switch (action.type) {
        case EVENTSEARCH:
            return {
                ...state,
                results: {},
                loading: true
            };
        case EVENTSEARCH_FAIL:
            return {
                ...state,
                results: {},
                loading: false
            };
        case EVENTSEARCH_SUCCESS:
            return {
                ...state,
                loading: false,
                results: action.payload
            };
        default:
            return state
    }
}
