import commonUtil from '../../../utils/commonUtil';
import API_MAP from '../../../endpoints';

export async function setSetDashboardUser(params, callback) {
  let query = {
    ...params
  }
  const response = await commonUtil.triggerPostRequest(API_MAP.set_dashboard_user, 'POST', query)
  if (typeof callback === 'function') {
    callback(response)
  }
}


export async function updateFraudEventStatus(params, callback) {
  // let query = {
  //     eventId: params.eventId,
  //     ...params
  // }
  const response = await commonUtil.triggerPostRequest(API_MAP.update_event_status, 'POST', params)
  if (typeof callback === 'function') {
    callback(response)
  }
}

