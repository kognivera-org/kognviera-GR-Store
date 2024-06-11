const initialState = {
    loading: false,
    nickname: false,
    data: {},
    addressSearch: {},
    addressAdded: false,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case 'ADD_ADDRESS':
            return {
                ...state,
                loading: true,
                addressAdded: false,
                error: null,
            }

        case 'ADD_ADDRESS_SUCCESS':
            return {
                ...state,
                data: { ...state.data, ...action.payload },
                // data: action.payload,
                loading: false,
                addressAdded: true,
                error: null,
            }

        case 'ADD_ADDRESS_FAILURE':
            return {
                ...state,
                loading: false,
                addressAdded: false,
                error: action.payload,
            }
        case 'UPDATE_ADDRESS':
            return {
                ...state,
                loading: true,
                addressUpdated: false,
                error: null,
            }

        case 'UPDATE_ADDRESS_SUCCESS':
            return {
                ...state,
                loading: false,
                addressUpdated: true,
                error: null,
            }

        case 'UPDATE_ADDRESS_FAILURE':
            return {
                ...state,
                loading: false,
                addressUpdated: false,
                error: action.payload,
            }
        case 'UPDATE_ADDRESS_GR':
            return {
                ...state,
                loading: true,
                addressUpdatedGR: false,
                error: null
            }

        case 'UPDATE_ADDRESS_GR_SUCCESS':
            return {
                ...state,
                loading: false,
                addressUpdatedGR: true,
                error: undefined,
            }

        case 'UPDATE_ADDRESS_GR_FAILURE':
            return {
                ...state,
                loading: false,
                addressUpdatedGR: false,
                error: action.payload,
            }

        default: return state;
    }
}