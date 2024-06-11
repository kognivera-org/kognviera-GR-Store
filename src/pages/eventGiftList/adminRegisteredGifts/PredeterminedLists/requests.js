import API_MAP from '../../../../endpoints'
import commonUtil from '../../../../utils/commonUtil'

export async function addToGiftList(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.add_Predetermined_Item, 'POST', values)
  if (typeof callback === 'function') {
    callback(response)
  }
}
