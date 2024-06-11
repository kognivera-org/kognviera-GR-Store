const initialState = {
    loading: false,
    error: {},
    eventDeliveryAddressData: {},
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case 'GETEVENTDELIVERYADDRESSES':
            return {
                ...state,
                loading: true,
            };
        case 'GETEVENTDELIVERYADDRESSES_SUCCESS':
            return {
                ...state,
                loading: false,
                eventDeliveryAddressData: action.payload,
                error: undefined
            };

        case 'GETEVENTDELIVERYADDRESSES_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'DELETEADDRESS':
            return {
                ...state,
                loading: true,
                eventDeliveryAddressData: {
                    ...state.eventDeliveryAddressData,
                    deleteSuccess: false,
                    error: null,
                }
            };
        case 'DELETEADDRESS_SUCCESS':
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: undefined,
                eventDeliveryAddressData: {
                    ...state.eventDeliveryAddressData,
                    data: action.payload,
                    deleteSuccess: true,
                }
            };

        case 'DELETEADDRESS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                eventDeliveryAddressData: {
                    ...state.eventDeliveryAddressData,
                    deleteSuccess: false,
                    error: action.payload,
                }
            };
        case 'ASSIGNADDRESS':
            return {
                ...state,
                loading: true,
            };
        case 'ASSIGNADDRESS_SUCCESS':
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: undefined,
                eventDeliveryAddressData: {
                    ...state.eventDeliveryAddressData,
                    AssignAddressSuccess: true,
                }
            };

        case 'ASSIGNADDRESS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                eventDeliveryAddressData: {
                    ...state.eventDeliveryAddressData,
                    AssignAddressSuccess: false,
                }
            };
        default: return state;
    }
}