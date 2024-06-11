import API_MAP from '../../../../endpoints'
import axios from 'axios'
import 'babel-polyfill'
import { executeEventDetail } from '../../EventDashboard/actions'


export function saveEditEvent(values) {
    return async (dispatch) => {
        try {
            dispatch({ type: 'SAVE_EDIT_EVENT' });
            const response = await axios.post(API_MAP.edit_event, {
                channel: values.channel,
                brand: values.brand,
                ownerId: values.ownerId,
                ownerTitle: values.ownerTitle,
                ownerfirstName: values.ownerfirstName,
                ownerlastName: values.ownerlastName,
                ownerMotherName: values.ownerMotherName,
                ownerDateofbirth: values.ownerDateofbirth,
                ownerPhone: values.ownerPhone,
                nickName: values.nickName,
                ownerHasPermission: values.ownerHasPermission,
                ownerEmail: values.ownerEmail,
                profileId: values.profileId,
            });
            const status = response.data.status;
            if (status && status.status && status.status.toLowerCase() === 'success') {
                dispatch(executeEventDetail(values.eventId, values.dashboardUserId));
                dispatch({ type: 'SAVE_EDIT_EVENT_SUCCESS', payload: response.data });
            }
        } catch (e) {
            dispatch({ type: 'SAVE_EDIT_EVENT_FAILURE', payload: e });
        }
    };
}


export function validateEmail(values) {
    return {
        types: ['VALIDATE_EMAIL', 'VALIDATE_EMAIL_SUCCESS', 'VALIDATE_EMAIL_FAILURE'],
        ping: client => client.post(API_MAP.verify_profile_url, {
            data: {
                email: values.email,
                eventType: values.eventType,
            },
        })
    }
}

export function clearValidateEmail(values) {
    return {
        type: 'CLEAR_VALIDATE_EMAIL',
    }
}

export function clearSaveEditEvent(values) {
    return {
        type: 'CLEAR_SAVEEDITEVENT',
    }
}

export function clearCoownerCreated(values) {
    return {
        type: 'CLEAR_COOWNERCREATED',
    }
}

export function createCoOwner(values) {
    let Channel = 'INSTORE';
    let Brand = 'LP';
    return {
        types: ['EDIT_CREATE_COOWNER', 'EDIT_CREATE_COOWNER_SUCCESS', 'EDIT_CREATE_COOWNER_FAILURE'],
        ping: client => client.post(API_MAP.create_profile_url, {
            data: {
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                maternalName: values.maternalName,
                bdayDAY: values.bdayDAY,
                bdayMONTH: values.bdayMONTH,
                bdayYEAR: values.bdayYEAR,
                gender: values.gender,
                // channel: values.channel,
                // brandName: values.brandName,
                autoLoginCheckbox: values.autoLoginCheckbox
            },
        }),
    }
}

