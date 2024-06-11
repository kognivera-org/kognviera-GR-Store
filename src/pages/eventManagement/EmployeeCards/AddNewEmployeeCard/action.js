import axios from 'axios'
import API_MAP from '../../../../endpoints'

export function addUpdateEmployeeCardDetails(values) {
    return {
        types: ['ADD_UPDATE_EMPLOYEE_CARD', 'ADD_UPDATE_EMPLOYEE_CARD_SUCCESS', 'ADD_UPDATE_EMPLOYEE_CARD_FAILURE'],
        ping: client => client.post(API_MAP.add_update_employee_card, {
            data: {
                cardId: values.cardId,
                eventId: values.eventId,
                firstName: values.firstName,
                lastName: values.lastName,
                cardNumber: values.cardNumber,
                middleName: values.middleName,
                motherLastName: values.motherLastName,
            }
        })
    }
}
export function getEmployeeDataForUpdate() {
    return async (dispatch) => {
        try {
            dispatch({ type: 'GET_EMPLOYEE_CARD_UPDATE', payload: {} });
        } catch (e) {

        }
    }
}
