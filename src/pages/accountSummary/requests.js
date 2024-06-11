import API_MAP from '../../endpoints';
import commonUtil from '../../utils/commonUtil';

export async function calculateCommision(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.calculateCommision, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}

export async function deleteBankOrCardDetails(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.deleteBankOrCardDetails, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}

export async function reAuthenticateUser(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.reAuthenticateUser, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}

export async function getEwalletInfo(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.getEwalletInfo, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}

export async function verifyStoreAssociate(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.verifyStoreAssociate, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}
export async function saveBankOrCardDetails(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.saveBankOrCardDetails, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}


export async function getTransferenceOptions(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.getTransferenceOptions, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}

export async function getOpeningOrClosingGiftDetailsForEvent(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.get_openingOrClosingGiftDetailsForEvent, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}

export async function initiateEventCloseProcess(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.initiateEventCloseProcess, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}

export async function getStatementDetailsForPrintAndDownload(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.getStatementDetailsForPrintAndDownload, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}

export async function sendMail(data, fileName, eventId, emailId, callback) {
  const formData = new FormData();
  formData.append('file', data);
  formData.append('documentName', fileName);
  formData.append('eventId', eventId);
  formData.append('emailId', emailId);
  const response = await commonUtil.triggerFormDataPostRequest(API_MAP.sendMail, 'POST', formData);
  if (typeof callback === 'function') {
    callback(response);
  }
}

export async function getEventDeliveryAddresses(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.get_delivery_addresses_url, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}

/* OTP API Validation functions. It's necessary to create a user and a device before create and send
an OTP code. The last function validates the otp code.
*/

export async function otpAuthenticate(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.otpAuthenticate, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}

export async function otpCreateUser(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.otpCreateUser, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}

export async function createDevice(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.createDevice, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}

export async function createOtp(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.createOtp, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}

export async function validateOtp(values, callback) {
  const response = await commonUtil.triggerPostRequest(API_MAP.validateOtp, 'POST', values);
  if (typeof callback === 'function') {
    callback(response);
  }
}
