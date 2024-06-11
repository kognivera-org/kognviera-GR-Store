const initialState = {
    loading: false,
    editAddressSuccess: false,
    error: {}
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {

        // case 'UPDATE_ADDRESS':
        //     return {
        //         ...state,
        //         loading: true,
        //         addressAdded: false,
        //         nickname: false,
        //     }

        // case 'UPDATE_ADDRESS_SUCCESS':
        //     return {
        //         ...state,
        //         data: { ...state.data, ...action.payload },
        //         // data: action.payload,
        //         loading: false,
        //         nickname: true,
        //         addressAdded: true,
        //         error: undefined,
        //     }

        // case 'UPDATE_ADDRESS_FAILURE':
        //     return {
        //         ...state,
        //         loading: false,
        //         nickname: false,
        //         addressAdded: false,
        //         error: action.payload,
        //     }


        default: return state;
    }
}