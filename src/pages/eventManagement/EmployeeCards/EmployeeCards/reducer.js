const initialState = {
    loading: false,
    data: undefined,
    error: {}
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {

        case 'GET_EMPLOYEE_CARD':
            return {
                ...state,
                loading: true,
            };
        case 'GET_EMPLOYEE_CARD_SUCCESS':
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: undefined,
            };

        case 'GET_EMPLOYEE_CARD_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                data: undefined,
            };
        default: return state;
    }
}