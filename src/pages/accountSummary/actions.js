import API_MAP from '../../endpoints';
import commonUtil from '../../utils/commonUtil';

export const ACCOUNTSTATEMENT_DETAILS = 'ACCOUNTSTATEMENT_DETAILS';
export const ACCOUNTSTATEMENT_DETAILS_SUCCESS = 'ACCOUNTSTATEMENT_DETAILS_SUCCESS';
export const ACCOUNTSTATEMENT_DETAILS_FAIL = 'ACCOUNTSTATEMENT_DETAILS_FAIL';


export function getEventAccountStatementDetails(eventId) {
  const _values = {
    // channel: commonUtil.getChannel(),
    // brand: commonUtil.getBrand(),
    eventId,
  };
  return {
    types: [ACCOUNTSTATEMENT_DETAILS, ACCOUNTSTATEMENT_DETAILS_SUCCESS, ACCOUNTSTATEMENT_DETAILS_FAIL],
    ping: client => client.post(API_MAP.getEventAccountStatementDetails, {
      data: { ..._values },
    }),
  };
}


export function getPurchasedItemSummaryInfo(eventId, type) {
  const _values = {
    // channel: commonUtil.getChannel(),
    // brand: commonUtil.getBrand(),
    eventId,
    type,
  };
  return {
    types: ['PURCHASEDITEMSUMMARYINFO_LOAD', 'PURCHASEDITEMSUMMARYINFO_LOAD_SUCCESS', 'PURCHASEDITEMSUMMARYINFO_LOAD_FAIL'],
    ping: client => client.post(API_MAP.getPurchasedItemSummaryInfo, {
      data: { ..._values },
    }),
  };
}

export function getPurchasedItemsDetails(eventId, type, filteringParameters, sortingParameters, currentPage, isShowAll) {
  const _values = {
    // channel: commonUtil.getChannel(),
    // brand: commonUtil.getBrand(),
    eventId,
    type,
    filteringParameters,
    sortingParameters,
    currentPage,
    isShowAll,
  };
  return {
    types: ['PURCHASEDITEMSDETAILS_LOAD', 'PURCHASEDITEMSDETAILS_LOAD_SUCCESS', 'PURCHASEDITEMSDETAILS_LOAD_FAIL'],
    ping: client => client.post(API_MAP.getPurchasedItemsDetails, {
      data: { ..._values },
    }),
  };
}

export function getBonusDetails(eventId) {
  const _values = {
    // channel: commonUtil.getChannel(),
    // brand: commonUtil.getBrand(),
    eventId,
  };
  return {
    types: ['BONUS_DETAILS', 'BONUS_DETAILS_SUCCESS', 'BONUS_DETAILS_FAIL'],
    ping: client => client.post(API_MAP.getBonusDetails, {
      data: { ..._values },
    }),
  };
}

export function getInTransitDetails(eventId) {
  const _values = {
    // channel: commonUtil.getChannel(),
    // brand: commonUtil.getBrand(),
    eventId,
  };
  return {
    types: ['IN_TRANSIT_DETAILS', 'IN_TRANSIT_DETAILS_SUCCESS', 'IN_TRANSIT_DETAILS_FAIL'],
    ping: client => client.post(API_MAP.getInTransitDetails, {
      data: { ..._values },
    }),
  };
}


// ------------Partial Transference---------------

//export function getTransferenceOptions(eventId, eventOwnerId, type, activatePhysicalWallet) {
export function getTransferenceOptions(eventId, eventOwnerId, type, activatePhysicalWallet) {
  const _values = {
    // channel: commonUtil.getChannel(),
    // brand: "LP",//commonUtil.getBrand(),
    eventId,
    eventOwnerId,
    type,
    activatePhysicalWallet,
  };
  return {
    types: ['TRANSFERENCE_OPTIONS', 'TRANSFERENCE_OPTIONS_SUCCESS', 'TRANSFERENCE_OPTIONS_FAIL'],
    ping: client => client.post(API_MAP.getTransferenceOptions, {
      data: { ..._values },
    }),
  };
}
export function submitTransference(values) {
  const _values = {
    // channel: commonUtil.getChannel(),
    // brand: commonUtil.getBrand(),
    ...values,
  };
  return {
    types: ['SUBMIT_TRANSFERENCE_DETAILS', 'SUBMIT_TRANSFERENCE_DETAILS_SUCCESS', 'SUBMIT_TRANSFERENCE_DETAILS_FAIL'],
    ping: client => client.post(API_MAP.submitTransference, {
      data: {
        ..._values,
      },
    }),
  };
}

//returns and refunds
export function submitRefundTransaction(values) {
  const _values = {
    // channel: commonUtil.getChannel(),
    // brand: commonUtil.getBrand(),
    ...values,
  };
  return {
    types: ['SUBMIT_REFUND', 'SUBMIT_REFUND_SUCCESS', 'SUBMIT_REFUND_FAIL'],
    ping: client => client.post(API_MAP.submitRefundTransaction, {
      data: {
        ..._values,
      },
    }),
  };
}

// verifyStoreAssociate
// export function verifyStoreAssociate(values) {
//   return {
//     types: ['VERIFY_STORE_ASSOCIATE', 'VERIFY_STORE_ASSOCIATE_SUCCESS', 'VERIFY_STORE_ASSOCIATE_FAIL'],
//     ping: client => client.post(API_MAP.verifyStoreAssociate, {
//       data: {
//         ...values,
//       },
//     }),
//   };
// }
export function getaccountPartialTransferDetails(eventId) {
  const _values = {
    // channel: commonUtil.getChannel(),
    // brand: commonUtil.getBrand(),
    eventId,
  };
  return {
    types: ['ACCOUNT_PARTIAL_TRANSFERENCE', 'ACCOUNT_PARTIAL_TRANSFERENCE_SUCCESS', 'ACCOUNT_PARTIAL_TRANSFERENCE_FAIL'],
    ping: client => client.post(API_MAP.getaccountPartialTransferDetails, {
      data: {
        ..._values,
      },
    }),
  };
}

// calculateCommison
export function calculateCommision(values) {
  return {
    types: ['CALCULATE_COMMOSION', 'CALCULATE_COMMOSION_SUCCESS', 'CALCULATE_COMMOSION_FAIL'],
    ping: client => client.post(API_MAP.calculateCommision, {
      data: {
        ...values,
      },
    }),
  };
}


export function getEventSummaryInfo(eventId, profileId, emailId) {
  const _values = {
    // channel: commonUtil.getChannel(),
    // brand: commonUtil.getBrand(),
    eventId,
    profileId,
    emailId,

  };
  return {
    types: ['EVENTSUMMARY_INFO', 'EVENTSUMMARY_SUCCESS', 'EVENTSUMMARY_FAIL'],
    ping: client => client.post(API_MAP.getEventSummaryInfo, {
      data: { ..._values },
    }),
  };
}

export function deleteBankOrCardDetails(accountId) {
  const _values = {
    // brand: commonUtil.getBrand(),
    // channel: commonUtil.getChannel(),
    accountId,

  };
  return {
    ping: client => client.post(API_MAP.deleteBankOrCardDetails, {
      data: { ..._values },
    }),
  };
}