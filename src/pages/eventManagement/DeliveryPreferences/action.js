import 'babel-polyfill';
import API_MAP from '../../../endpoints';
import axios from 'axios';

export const GET_PEREFERENCE_DELIVERY_ADDRESS = 'GET_PEREFERENCE_DELIVERY_ADDRESS';
export const GET_PEREFERENCE_DELIVERY_ADDRESS_SUCCESS = 'GET_PEREFERENCE_DELIVERY_ADDRESS_SUCCESS';
export const GET_PEREFERENCE_DELIVERY_ADDRESS_ERROR = 'GET_PEREFERENCE_DELIVERY_ADDRESS_ERROR';

export const SAVE_PEREFERENCE_DELIVERY_ADDRESS = 'SAVE_PEREFERENCE_DELIVERY_ADDRESS';
export const SAVE_PEREFERENCE_DELIVERY_ADDRESS_SUCCESS = 'SAVE_PEREFERENCE_DELIVERY_ADDRESS_SUCCESS';
export const SAVE_PEREFERENCE_DELIVERY_ADDRESS_ERROR = 'SAVE_PEREFERENCE_DELIVERY_ADDRESS_ERROR';

export const getPreferredDeliveryDayDetails = (eventId, preferredDeliveryDayOptedValue) => {
    return async (dispatch) => {
        try {
            dispatch({ type: 'GET_PEREFERENCE_DELIVERY_ADDRESS' });
            const response = await axios.post(API_MAP.get_PreferenceDeliveryAddress, {
                channel: 'INSTORE',
                brand: 'LP',
                eventId,
                preferredDeliveryDayOpted: preferredDeliveryDayOptedValue
            });
            const status = response.data.status;
            // business logic according to payload
            if (status && status.status && status.status.toLowerCase() === 'success') {

                const preferredDeliveryDayDetails = response.data.preferredDeliveryDayDetails ? response.data.preferredDeliveryDayDetails : null;
                dispatch({ type: 'GET_PEREFERENCE_DELIVERY_ADDRESS_SUCCESS', payload: preferredDeliveryDayDetails });
            } else {
                dispatch({ type: 'GET_PEREFERENCE_DELIVERY_ADDRESS_ERROR', payload: response.data.status });
            }
        } catch (e) {
            dispatch({ type: 'GET_PEREFERENCE_DELIVERY_ADDRESS_ERROR', payload: e });
        }
    };
}

export const saveDayoftheWeekForAddress = (eventId, saveDayoftheWeekInfo, preferenceDeliveryAddress) => {
    return async (dispatch) => {
        try {
            dispatch({ type: 'SAVE_PEREFERENCE_DELIVERY_ADDRESS' });
            const response = await axios.post(API_MAP.save_DayoftheWeekForAddress, {
                channel: 'INSTORE',
                brand: 'LP',
                eventId,
                saveDayoftheWeekInfo
            });
            const status = response.data.status;
            // business logic according to payload
            if (status && status.status && status.status.toLowerCase() === 'success') {
                dispatch({ type: 'SAVE_PEREFERENCE_DELIVERY_ADDRESS_SUCCESS', payload: preferenceDeliveryAddress });
            } else {
                dispatch({ type: 'SAVE_PEREFERENCE_DELIVERY_ADDRESS_ERROR', payload: response.data.status });
            }
        } catch (e) {
            dispatch({ type: 'SAVE_PEREFERENCE_DELIVERY_ADDRESS_ERROR', payload: e });
        }
    };
}