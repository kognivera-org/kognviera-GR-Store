let initialState = { loaded: false };
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'LOAD_ACTIVITY_LOGS':
            return {
                ...state, loading: true
            }
        case 'LOAD_ACTIVITY_LOGS_SUCCESS':
            return {
                ...state, loading: false, loaded: true, activityLogs: action.payload, error: null
            }
        case 'LOAD_ACTIVITY_LOGS_FAIL':
            return {
                ...state, loading: false, loaded: false, activityLogs: null, error: action.payload
            }
        default:
            return state
    }
}
