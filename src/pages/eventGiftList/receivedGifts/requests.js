import API_MAP from '../../../endpoints';
import commonUtil from '../../../utils/commonUtil';

export async function savePurchaserName(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.save_purchaser_name, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}
export async function addAgainGiftItem(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.add_again_gift_item, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}

export async function downloadReceivedGiftsMessages(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.get_Received_Gifts_Messages, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}
export async function addMessage(values, callback, param) {
  const response = await commonUtil.triggerPostRequest(API_MAP.add_message, 'POST', values);
  if (typeof callback === 'function') {
    callback(response, param);
  }
}
export async function deleteMessage(values, callback, param) {
  const response = await commonUtil.triggerPostRequest(API_MAP.delete_message, 'POST', values);
  if (typeof callback === 'function') {
    callback(response, param);
  }
}