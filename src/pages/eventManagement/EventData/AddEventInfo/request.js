import commonUtil from '../../../../utils/commonUtil';
import API_MAP from '../../../../endpoints';

export async function addEventInfoData(params, callback) {
    const response = await commonUtil.triggerPostRequest(API_MAP.add_event_info, 'POST', params)
    if (typeof callback === 'function') {
        callback(response)
    }
}