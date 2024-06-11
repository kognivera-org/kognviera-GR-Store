let initialState = { loaded: false };
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'LABELS':
            return {
                ...state,
                loading: true
            }
        case 'LABELS_SUCCESS':
            return {
                ...state, loading: false,
                loaded: true,
                labels: action.payload,
            }
        case 'LABELS_FAILURE':
            return {
                ...state,
                loading: false,
                loaded: false,
                error: action.payload
            }
        default:
            return state
    }
}
