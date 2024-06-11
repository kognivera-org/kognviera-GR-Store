import axios from 'axios'
import API_MAP from 'endpoints'
import errorHandler from '../../../pages/global/errorHandler'

// Login Actions
export function loginUser(values) {
    return {
        types: ['LOGIN', 'LOGIN_SUCCESS', 'LOGIN_FAILURE'],
        ping: client => client.post(API_MAP.user_login_url, {
            data: {
                username: values.email,
                password: values.password
            }
        })
    }
}


// Login Actions
export function logoutUser(storeAssociateId) {
    let Channel = 'INSTORE';
    let Brand = 'LP';
    return {
        types: ['LOGOUT', 'LOGOUT_SUCCESS', 'LOGOUT_FAIL'],
        ping: client => client.post(API_MAP.user_logout_url, {
            data: {
                storeAssociateId
            }
        })
    }
}

export function updatePassword(values) {

    return {
        types: ['UPDATE_PASSWORD', 'UPDATE_PASSWORD_SUCCESS', 'UPDATE_PASSWORD_FAIL'],
        ping: client => client.post(API_MAP.update_password_url, {
            data: {
                ...values
            }
        })
    }

}