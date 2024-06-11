//import 'babel-polyfill'
import axios from 'axios'
import API_MAP from '../../../endpoints'

export function addNewCreditCardDetails(values) {

    return {
        types: ['ADD_EMPLOYEE_CARD', 'ADD_EMPLOYEE_CARD_SUCCESS', 'ADD_EMPLOYEE_CARD_FAILURE'],
        ping: client => client.post(API_MAP.add_update_dilisa_card, {
            data: {
                ...values
            }
        })
    }

}

export function updateEmployeeCardDetails(eventData, values, idx) {
    // idx is index which we get from url

    const employeeCardData = eventData && eventData.employeeCardData ? eventData.employeeCardData : []
    if (idx) {
        employeeCardData[idx] = values //updated value
    } else {
        employeeCardData.push(values)
    }
    //but jb add hga card tb kaise? uss condition me 
    // const filteredData = employeeCardData.filter(function (data, index) {
    //     // return values.cardNumber !== data.cardNumber
    // })

    // filteredData.push(values);

    return async (dispatch) => {
        dispatch({ type: 'UPDATE_EMPLOYEE_CARD_DETAILS', payload: employeeCardData })
    }
}