import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import { reducer as hapines } from './react-hapines'

import user from '../pages/login/LoginPage/reducer';
import activityLog from '../pages/browse/MainDashboard/reducer';
import selectStore from '../pages/browse/MainDashboard/components/SelectStoreModal/reducer';
import searchevents from '../pages/eventSearch/EventSearchResults/reducer';
import eventdetails from '../pages/eventSearch/EventDetails/reducer';
import contract from '../pages/createevent/globalevent/StepG/reducer';
import createevent from '../pages/createevent/reducer';
import delivery from 'pages/createevent/globalevent/StepF/reducer';
import employeeCard from '../pages/createevent/employeeCreditCardInfo/reducer';
import eventdashboard from '../pages/eventManagement/EventDashboard/reducer';
import addAddress from '../pages/createevent/address/reducer';
import selectAddress from '../pages/createevent/globalevent/StepE/reducer'
import labels from '../pages/global/Labels/reducer';
import verificationDocument from '../pages/eventManagement/VerificationDocuments/reducer';
import accountSummary from '../pages/accountSummary/reducer';
import giftListManagement from '../pages/eventGiftList/reducer';
import regalorecibidos from '../pages/eventGiftList/receivedGifts/reducer';
import predeterminedLists from '../pages/eventGiftList/adminRegisteredGifts/PredeterminedLists/reducer';
import saveeditevent from 'pages/eventManagement/EventData/EditEventInfo/reducer'
import geteventdata from 'pages/eventManagement/EventData/EventGralInfo/reducer'
import preferenceDelivery from '../pages/eventManagement/DeliveryPreferences/reducer';
import reports from '../pages/reports/reducer';
import personalPurchase from '../pages/eventGiftList/personalPurchase/reducer'
import eventAddresses from '../pages/eventManagement/EventAddress/EventAddressInfo/reducer';
import eventMgmtAddress from '../pages/eventManagement/EventAddress/AddNewAddress/reducer'
//import editAddress from '../pages/eventManagement/EventAddress/EditAddress/reducer'
import header from '../pages/global/Header/components/EventHeader/reducer'
import getEmployeeCardDetails from '../pages/eventManagement/EmployeeCards/EmployeeCards/reducer';
import addUpdateEmployeeCardDetails from '../pages/eventManagement/EmployeeCards/AddNewEmployeeCard/reducer';
import addEventInfo from '../pages/eventManagement/EventData/AddEventInfo/reducer';
import returnAndRefund from '../pages/return/reducer';
import changeOfEvent from '../pages/changeOfEvent/reducer';

export default combineReducers({
  // accountStatementDetails,
  //editAddress,
  accountSummary,
  activityLog,
  addAddress,
  addEventInfo,
  addUpdateEmployeeCardDetails,
  changeOfEvent,
  contract,
  createevent,
  delivery,
  employeeCard,
  eventAddresses,
  eventdashboard,
  eventdetails,
  eventMgmtAddress,
  getEmployeeCardDetails,
  geteventdata,
  giftListManagement,
  hapines,
  header,
  labels,
  personalPurchase,
  predeterminedLists,
  preferenceDelivery,
  reduxAsyncConnect,
  regalorecibidos,
  reports,
  returnAndRefund,
  routing: routerReducer,
  saveeditevent,
  searchevents,
  selectAddress,
  selectStore,
  user,
  verificationDocument,
});

