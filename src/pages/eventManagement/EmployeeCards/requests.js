import API_MAP from '../../../endpoints';
import commonUtil from '../../../utils/commonUtil';

export async function removeEmployeeCard(values, callback) {
    const response = await commonUtil.triggerPostRequest(API_MAP.remove_employee_card, 'POST', values);
    if (typeof callback === 'function') {
        callback(response);
    }
}