

const initialState = {
    employeeCardAdded: false,
}
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {

        case 'ADD_EMPLOYEE_CARD':
            return {
                ...state,
                employeeCardAdded: false,
                employeeCard: null
            };

        case 'ADD_EMPLOYEE_CARD_SUCCESS':
            return {
                ...state,
                employeeCard: action.payload,
                employeeCardAdded: true,
                error: undefined
            };

        case 'ADD_EMPLOYEE_CARD_FAILURE':
            return {
                ...state,
                employeeCardAdded: false,
                error: action.payload
            };

        default:
            return state
    }
}