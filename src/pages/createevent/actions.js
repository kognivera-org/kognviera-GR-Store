import 'babel-polyfill'
import API_MAP from '../../endpoints'
import config from 'config/appconfig'
// import { EVENTDETAIL, EVENTDETAIL_SUCCESS, EVENTDETAIL_FAIL } from '../eventManagement/EventDashboard/actions';

export function handleSelectGRType(values) {
    return async (dispatch) => {
        const payload = {
            GRType: { ...values },
        }
        dispatch({ type: 'SELECT_EVENT_TYPE', payload })
    }
}

export function getEventCategories() {
    const Channel = 'INSTORE'
    const Brand = 'LP'
    return {
        types: ['EVENT_CATEGORIES', 'EVENT_CATEGORIES_SUCCESS', 'EVENT_CATEGORIES_FAILURE'],
        ping: client => client.post(API_MAP.get_event_categories, {
            data: {
                channel: Channel,
                brand: Brand,
            },
        }),
    }
}

export function getCategorySpecificEvents(categoryType) {

    const Channel = 'INSTORE'
    const Brand = 'LP'
    return {
        types: ['CATEGORY_EVENTS', 'CATEGORY_EVENTS_SUCCESS', 'CATEGORY_EVENTS_FAILURE'],
        ping: client => client.post(API_MAP.category_specific_events, {
            data: {
                categoryType,
            },
        }),
    }
}


export function updateEmailIds(emailId, type) {
    const actionReqType = (type == 'owner') ? 'UPDATE_OWNER_EMAIL' : (type == 'coOwner') ? 'UPDATE_COOWNER_EMAIL' : 'UPDATE_COOWNER2_EMAIL'
    const actionSuccessType = (type == 'owner') ? 'UPDATE_OWNER_EMAIL_SUCCESS' : (type == 'coOwner') ? 'UPDATE_COOWNER_EMAIL_SUCCESS' : 'UPDATE_COOWNER2_EMAIL_SUCCESS'
    return async (dispatch) => {
        dispatch({ type: actionReqType })
        dispatch({ type: actionSuccessType, payload: { emailId } })
    }
}


export function handleOwnerAccValidation(emailId, eventType) {

    const Channel = 'INSTORE'
    const Brand = 'LP'
    return {
        types: ['VALIDATE_OWNER', 'VALIDATE_OWNER_SUCCESS', 'VALIDATE_OWNER_FAILURE'],
        ping: client => client.post(API_MAP.verify_profile_url, {
            data: {
                email: emailId,
                eventType,
            },
        }),
    }
}

export function handleCoownerAccValidation(emailId, eventType) {

    const Channel = 'INSTORE'
    const Brand = 'LP'
    return {
        types: ['VALIDATE_COOWNER', 'VALIDATE_COOWNER_SUCCESS', 'VALIDATE_COOWNER_FAILURE'],
        ping: client => client.post(API_MAP.verify_profile_url, {
            data: {
                email: emailId,
                eventType,
            },
        }),
    }
}

export function handleCoowner2AccValidation(emailId, eventType) {

    const Channel = 'INSTORE'
    const Brand = 'LP'
    return {
        types: ['VALIDATE_COOWNER2', 'VALIDATE_COOWNER2_SUCCESS', 'VALIDATE_COOWNER2_FAILURE'],
        ping: client => client.post(API_MAP.verify_profile_url, {
            data: {
                email: emailId,
                eventType,
            },
        }),
    }
}

export function handleOwnerEligibility(emailId, eventType) {

    const Channel = 'INSTORE'
    const Brand = 'LP'
    return {
        types: ['OWNER_ELIGIBLE', 'OWNER_ELIGIBLE_SUCCESS', 'OWNER_ELIGIBLE_FAILURE'],
        ping: client => client.post(API_MAP.coOwner_eligible, {
            data: {
                emailId,
                eventType,
            },
        }),
    }
}

export function handleCoownerEligibility(emailId, eventType) {

    const Channel = 'INSTORE'
    const Brand = 'LP'
    return {
        types: ['COOWNER_ELIGIBLE', 'COOWNER_ELIGIBLE_SUCCESS', 'COOWNER_ELIGIBLE_FAILURE'],
        ping: client => client.post(API_MAP.coOwner_eligible, {
            data: {
                emailId,
                eventType,
            },
        }),
    }
}

export function handleCoowner2Eligibility(emailId, eventType) {

    const Channel = 'INSTORE'
    const Brand = 'LP'
    return {
        types: ['COOWNER2_ELIGIBLE', 'COOWNER2_ELIGIBLE_SUCCESS', 'COOWNER2_ELIGIBLE_FAILURE'],
        ping: client => client.post(API_MAP.coOwner_eligible, {
            data: {
                emailId,
                eventType,
            },
        }),
    }
}

export function handleCreateProfile(values) {
    return {
        types: ['CREATE_PROFILE', 'CREATE_PROFILE_SUCCESS', 'CREATE_PROFILE_FAILURE'],
        ping: client => client.post(API_MAP.create_profile_url, {
            data: {
                ...values,
            },
        }),
    }
}

export function handleCreateCoowner(values) {
    return {
        types: ['CREATE_COOWNER', 'CREATE_COOWNER_SUCCESS', 'CREATE_COOWNER_FAILURE'],
        ping: client => client.post(API_MAP.create_profile_url, {
            data: {
                ...values,
            },
        }),
    }
}

export function handleCreateCoowner2(values) {
    return {
        types: ['CREATE_COOWNER2', 'CREATE_COOWNER2_SUCCESS', 'CREATE_COOWNER2_FAILURE'],
        ping: client => client.post(API_MAP.create_profile_url, {
            data: {
                ...values,
            },
        }),
    }
}

export function validateEventName(values) {
    return {
        types: ['VALIDATE_EVENT_NAME', 'VALIDATE_EVENT_NAME_SUCCESS', 'VALIDATE_EVENT_NAME_FAILURE'],
        ping: client => client.post(API_MAP.validate_event_name, {
            data: {
                ...values
            }
        })
    }
}

export function handleOwnerData(values) {
    return async (dispatch) => {
        dispatch({ type: 'UPDATE_OWNER_DATA' })
        dispatch({ type: 'UPDATE_OWNER_DATA_SUCCESS', payload: { ...values } })
    }
}

export function handleCoownerData(values) {
    return async (dispatch) => {
        dispatch({ type: 'UPDATE_COOWNER_DATA' })
        dispatch({ type: 'UPDATE_COOWNER_DATA_SUCCESS', payload: { ...values } })
    }
}

export function handleCoowner2Data(values) {
    return async (dispatch) => {
        dispatch({ type: 'UPDATE_COOWNER2_DATA' })
        dispatch({ type: 'UPDATE_COOWNER2_DATA_SUCCESS', payload: { ...values } })
    }
}

export function updateEventAddresses(values) {
    return async (dispatch) => {
        dispatch({ type: 'UPDATE_EVENT_ADDRESSES', payload: values })
    }
}

export function updatePreferredDeliveryDays(values) {
    return async (dispatch) => {
        dispatch({ type: 'UPDATE_PREFERRED_DAYS', payload: values })
    }
}

export function flushDeliveryPreference() {
    return async (dispatch) => {
        dispatch({ type: 'FLUSH_PREFERRED_DAYS' })
    }
}

export function enableSaveButton() {
    return async (dispatch) => {
        dispatch({ type: 'ENABLE_SAVE_BUTTON' })
    }
}

export function createEvent(values) {
    return {
        types: ['CREATE_EVENT', 'CREATE_EVENT_SUCCESS', 'CREATE_EVENT_FAILURE'],
        ping: client => client.post(API_MAP.create_event, {
            data: {
                ...values,
                imageURL: config.imageUrl,
            },
        }),
    }
}

export function flushDilisaCard() {
    return async (dispatch) => {
        dispatch({ type: 'FLUSH_DILISA_CARD' })
    }
}

export function handleCheckbox(value) {
    if (value) {
        return async (dispatch) => {
            dispatch({ type: 'HANDLE_CHECKED_CHECKBOX' })
        }
    } else {
        return async (dispatch) => {
            dispatch({ type: 'HANDLE_UNCHECKED_CHECKBOX' })
        }
    }
}

export function flushCreateEventData() {
    return async (dispatch) => {
        dispatch({ type: 'FLUSH_CREATEEVENT_DATA' })
    }
}

export function resetEventData() {
    return async (dispatch) => {
        dispatch({ type: 'RESET_EVENT_DATA' })
    }
}

export function resetAddressList() {
    return async (dispatch) => {
        dispatch({ type: 'RESET_ADDRESS_LIST' })
    }
}

