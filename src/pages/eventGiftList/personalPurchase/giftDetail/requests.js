import commonUtil from '../../../../utils/commonUtil';

export async function updateBonusInfoReq(params, callback) {
    const response = await commonUtil.triggerPostRequest('/api/updateBonusSelection', 'POST', params);
    if (typeof callback === 'function') {
        callback(response);
    }
}