const initialState = {
    loading: false,
    loggedin: false,
    loggedOut: false,
    data: {},
    error: {}
};
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                loading: true,
                loggedin: false,
                error: undefined
            };

        case 'LOGIN_SUCCESS':
            return {
                ...state,
                loading: false,
                loggedin: true,
                loggedOut: false,
                data: action.payload,
                error: undefined
            };

        case 'LOGIN_FAILURE':
            return {
                ...state,
                loading: false,
                loggedin: false,
                loggedOut: true,
                error: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                loggedOut: false,
                loggingOut: true,
            }
        case 'LOGOUT_SUCCESS':
            return {
                ...state,
                loggingOut: false,
                loggedOut: true,
                loggedin: false,
                user: null,
            }
        case 'LOGOUT_FAIL':
            return {
                ...state,
                loggingOut: false,
                // log out user even after failure.
                loggedOut: true,
                user: null,
                logoutError: action.payload,
            }
        case 'UPDATE_PASSWORD':
            return {
                ...state,
                updatingPassword: true,
                passwordUpdated: false,
                updatePasswordError: null,
            }
        case 'UPDATE_PASSWORD_SUCCESS':
            return {
                ...state,
                updatingPassword: false,
                passwordUpdated: true,
                updatePasswordError: null,
            }
        case 'UPDATE_PASSWORD_FAIL':
            return {
                ...state,
                updatingPassword: false,
                passwordUpdated: false,
                updatePasswordError: action.payload,
            }
        default: return state;
    }
}