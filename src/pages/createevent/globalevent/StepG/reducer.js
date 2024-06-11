let initialState = {
    // acceptContract,
    data: {},
    error: {}
};
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'GETCONTRACTDETAILS':
            return {
                ...state,
            }
        case 'GETCONTRACTDETAILS_SUCCESS':
            return {
                ...state,
                data: action.payload,
                error: undefined
            }
        case 'GETCONTRACTDETAILS_FAILURE':
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}
