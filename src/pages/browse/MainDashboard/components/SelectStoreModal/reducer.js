const initialState = {
    loading: false,
    loggedin: false,
    loggedOut: false,
    error: {}
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case 'GETSTATES':
            return {
                ...state,
                loadingStates: true,
                loggedin: false
            };
        case 'GETSTATES_SUCCESS':
            return {
                ...state,
                loadingStates: false,
                loggedin: true,
                loggedOut: false,
                data: action.payload,
                error: undefined
            };

        case 'GETSTATES_FAILURE':
            return {
                ...state,
                loadingStates: false,
                loggedin: false,
                loggedOut: true,
                error: action.payload
            };
        case 'GETSTORES':
            return {
                ...state,
                loadingStores: true,
                loggedin: false
            };
        case 'GETSTORES_SUCCESS':
            return {
                ...state,
                loadingStores: false,
                loggedin: true,
                loggedOut: false,
                data: { ...state.data, ...action.payload },
                error: undefined
            };

        case 'GETSTORES_FAILURE':
            return {
                ...state,
                loadingStores: false,
                loggedin: false,
                loggedOut: true,
                error: action.payload
            };
        case 'SAVE_STORE':
            return {
                ...state,
                savingStore: true
            }
        case 'SAVE_STORE_SUCCESS':
            return {
                ...state,
                savingStore: false,
                saved: true,
                storeBrandName: action.payload.brandName,
                savedStoreId: action.payload.storeId,
                error: null
            }
        case 'SAVE_STORE_FAIL':
            return {
                ...state,
                savingStore: false,
                saved: false,
                error: action.payload
            }
        default: return state;
    }
}