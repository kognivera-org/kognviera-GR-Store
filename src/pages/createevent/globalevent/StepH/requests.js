import commonUtil from '../../../../utils/commonUtil'

export async function addPlasticCard(plasticCardData, callback) {
  const response = await commonUtil.triggerPostRequest('/api/addPlasticCard', 'POST', plasticCardData)
  if (typeof callback === 'function') {
      callback(response)
    }
}
