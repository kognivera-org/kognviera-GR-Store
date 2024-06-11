const initialState = {
    selectedAddresses: [],
    selectedAssignees: {},
}
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_SELECTED_ADDRESSES':
            return {
                ...state,
                selectedAddresses: action.payload,
            }
        case 'UPDATE_SELECTED_ASSIGNEES':
            return {
                ...state,
                selectedAssignees: action.payload,
            }
        case 'FLUSH_SELECTED_ASSIGNEES':
            return {
                ...state,
                selectedAssignees: {},
            }
        case 'FLUSH_CREATEEVENT_DATA':
            return initialState
        default:
            return state
    }
}
