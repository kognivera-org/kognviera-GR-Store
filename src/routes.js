import React from 'react'
import { IndexRoute, Route } from 'react-router'

import {
  App,
} from './containers'

import {
  ClosureEwalletSummary,
  PartialEwalletSummary,
  TransferanceCombinedSummary,
  DayTracker,
  MainDashboard,
  AccountInfoCelebrated1,
  AccountInfoCelebrated2,
  AccountInfoCelebrated3,
  AccountInfoCelebrated4,
  AddNewAddress,
  EditAddress,
  MultipleAddressSelection,
  SingleAddressSelection,
  CardAssigment,
  BasicForm,
  BasicForm2,
  BasicForm3,
  BasicFormFull,
  BasicFormFull2,
  BasicFormFull3,
  FormManagement,
  FormManagement3,
  FormManagementFull,
  FormManagementFull3,
  FormSimple,
  FormSimple3,
  FormSimpleFull,
  FormSimpleFull3,
  Mixins,
  Contract,
  DeliveryPreferences,
  AddNewCreditCard,
  EmployeeCreditCardInfo,
  EventInputInfo,
  InputEmailCelebrated,
  SelectGRType,
  // DefaultList,
  // DefaultListDetail,
  PersonalPurchase,
  ReceivedGifts,
  RegisterModal,
  SuccessRegisterModal,
  RegisteredGifts,
  EventManagementContract,
  EventDashboard,
  Preferences,
  AddNewEmployeeCard,
  EditEmployeeCard,
  EmployeeCards,
  AddNewAddress2,
  EditAddress2,
  EventAddressInfo,
  EditEventInfo,
  AddEventInfo,
  EventGralInfo,
  CalendarModal,
  PermissionsModal,
  StoreModal,
  DataResultTest,
  Movements,
  VerificationDocuments,
  EventDetails,
  LoginPage,
  UpdatePassword,
  UpdatePasswordNow,
  RegisterModal2,
  SuccessRegisterModal2,
  // PartialTransferenceConfirmation,
  // PartialTransferenceFailedSummary2,
  AddNewManager,
  CelebratedCardInfo,
  ChangeOfEvent,
  EventContract,
  EventInfo,
  SelectAddress,
  SelectAddress2,
  SelectedCelebrated,
  SelectEventType,
  EventSearchResults,
  StepA,
  StepB,
  StepC,
  StepD,
  StepE,
  StepF,
  StepG,
  StepH,
  StepI,

  // Account Transference
  BonusDetail,
  ElectronicGiftsDetail,
  PersonalPurchasesDetail,
  PhysicalGiftsDetail,
  StatementAccountSummary,
  StatementPartialTransference,
  PartialTransference,
  PartialConfirmation,
  ClosureTransference,
  ClosureConfirmation,
  // END Account Transference

  // Intransitmodal,
  ReportSummary,
  PredeterminedLists,
  PredeterminedListsDetailsWeb,
  AddBallotModal,
  DeleteBallotModal,
  DownloadPdf,
  SearchForReturn,
  RefundsLandingPage,
  ReturnRefundConfirmation,

  DeleteCache,
  FlushCache,
  HealthCheck,
  InstanceCheck,

} from './pages'

import routeconfig from './config/routeconfig'

export default store =>

  // check if sessionStorage has user object
  // const requireLogin = (nextState, replace, cb) => {
  // 	function checkAuth() {
  // 		const { auth: { user } } = store.getState()
  // 		if (!user.inStoreUserInfo) {
  // 			// oops, not logged in, so can't be here!
  // 			replace('/login')
  // 		}
  // 		cb()
  // 	}

  // 	if (!isAuthLoaded(store.getState())) {
  // 		store.dispatch(loadAuth()).then(checkAuth)
  // 	} else {
  // 		checkAuth()
  // 	}
  // }

	/**
	 * Please keep routes in alphabetical order
	 */
  (
    <div>
      <Route path={routeconfig.root} component={App}>
        { /* Home (main) route */}
        <IndexRoute component={LoginPage} />

        <Route path={routeconfig.downloadPrint} component={DownloadPdf} />

        <Route path={routeconfig.login} component={LoginPage} />

        <Route path={routeconfig.closureewalletsummary} component={ClosureEwalletSummary} requiresUser="true" />
        <Route path={routeconfig.partialewalletsummary} component={PartialEwalletSummary} requiresUser="true" />
        <Route path={routeconfig.transferancecombinedsummary} component={TransferanceCombinedSummary} requiresUser="true" />

        <Route path={routeconfig.daytracker} component={DayTracker} />
        <Route path={routeconfig.maindashboard} component={MainDashboard} hideBackClick={true} />

        <Route path={routeconfig.addnewaddress} component={AddNewAddress} showWarning="true" />
        <Route path={routeconfig.editaddress} component={EditAddress} />
        <Route path={routeconfig.multipleaddressselection} component={MultipleAddressSelection} />
        <Route path={routeconfig.singleaddressselection} component={SingleAddressSelection} />
        <Route path={routeconfig.cardassigment} component={CardAssigment} />


        <Route path={routeconfig.contract} component={Contract} />
        <Route path={routeconfig.deliverypreferences} component={DeliveryPreferences} />
        <Route path={routeconfig.addnewcreditcard} component={AddNewCreditCard} showWarning="true" />
        <Route path={routeconfig.employeecreditcardinfo} component={EmployeeCreditCardInfo} />
        <Route path={routeconfig.eventinputinfo} component={EventInputInfo} />
        <Route path={routeconfig.inputemailcelebrated} component={InputEmailCelebrated} />
        <Route path={routeconfig.selectgrtype} component={SelectGRType} />

        <Route path={routeconfig.personalpurchase} component={PersonalPurchase} />
        <Route path={routeconfig.receivedgifts} component={ReceivedGifts} />
        <Route path={routeconfig.registermodal} component={RegisterModal} />
        <Route path={routeconfig.successregistermodal} component={SuccessRegisterModal} />
        <Route path={routeconfig.registeredgifts} component={RegisteredGifts} />
        <Route path={routeconfig.eventManagementContract} component={EventManagementContract} />
        <Route path={routeconfig.eventdashboard} component={EventDashboard} showWarning="true" headerActions={true} />
        <Route path={routeconfig.preferences} component={Preferences} showWarning="true" headerActions={true} />
        <Route path={routeconfig.addnewemployeecard} component={AddNewEmployeeCard} showWarning="true" headerActions={true} />
        <Route path={routeconfig.editemployeecard} component={AddNewEmployeeCard} showWarning="true" headerActions={true} />
        <Route path={routeconfig.employeecards} component={EmployeeCards} showWarning="true" headerActions={true} />
        <Route path={routeconfig.addnewaddress2} component={AddNewAddress2} showWarning="true" headerActions={true} />
        <Route path={routeconfig.editaddress2} component={EditAddress2} showWarning="true" headerActions={true} />
        <Route path={routeconfig.eventaddressinfo} component={EventAddressInfo} showWarning="true" headerActions={true} />
        <Route path={routeconfig.editeventinfo} component={EditEventInfo} showWarning="true" headerActions={true} />
        <Route path={routeconfig.addeventinfo} component={AddEventInfo} showWarning="true" headerActions={true} />
        <Route path={routeconfig.eventgralinfo} component={EventGralInfo} showWarning="true" headerActions={true} />
        <Route path={routeconfig.calendarmodal} component={CalendarModal} />
        <Route path={routeconfig.permissionsmodal} component={PermissionsModal} />
        <Route path={routeconfig.storemodal} component={StoreModal} />
        <Route path={routeconfig.dataresulttest} component={DataResultTest} />
        <Route path={routeconfig.movements} component={Movements} />
        <Route path={routeconfig.verificationdocuments} component={VerificationDocuments} showWarning="true" headerActions={true} />
        <Route path={routeconfig.EventDetails} component={EventDetails} />
        <Route path={routeconfig.registermodal} component={RegisterModal2} />
        <Route path={routeconfig.successregistermodal} component={SuccessRegisterModal2} />
        {/* <Route path={routeconfig.partialtransferenceconfirmation} component={PartialTransferenceConfirmation} /> */}
        {/* <Route path={routeconfig.partialtransferencefailedsummary2} component={PartialTransferenceFailedSummary2} /> */}
        {/* <Route path={routeconfig.partialtransferencesummary} component={PartialTransferenceSummary} /> */}

        <Route path={routeconfig.addnewmanager} component={AddNewManager} />
        <Route path={routeconfig.celebratedcardinfo} component={CelebratedCardInfo} showWarning="true" showBrowserWarning="true" />
        <Route path={routeconfig.changeofevent} component={ChangeOfEvent} />

        <Route path={routeconfig.eventcontract} component={EventManagementContract} showWarning="true" headerActions={true} />
        <Route path={routeconfig.eventinfo} component={EventInfo} showWarning="true" showBrowserWarning="true" />
        <Route path={routeconfig.selectaddress} component={SelectAddress} showWarning="true" showBrowserWarning="true" />
        <Route path={routeconfig.selectaddress2} component={SelectAddress2} />
        <Route path={routeconfig.selectedcelebrated} component={SelectedCelebrated} showWarning="true" showBrowserWarning="true" />
        <Route path={routeconfig.selecteventtype} component={SelectEventType} showWarning="true" showBrowserWarning="true" />
        <Route path={routeconfig.eventsearch} component={EventSearchResults} />
        <Route path={routeconfig.updatedcontract} component={EventContract} showWarning="true" showBrowserWarning="true" />

        <Route path={routeconfig.globalstepa} component={StepA} showWarning="true" />
        <Route path={routeconfig.globalstepb} component={StepB} showWarning="true" showBrowserWarning="true" />
        <Route path={routeconfig.globalstepc} component={StepC} showWarning="true" showBrowserWarning="true" />
        <Route path={routeconfig.globalstepd} component={StepD} showWarning="true" showBrowserWarning="true" />
        <Route path={routeconfig.globalstepe} component={StepE} showWarning="true" showBrowserWarning="true" />
        <Route path={routeconfig.globalstepf} component={StepF} showWarning="true" showBrowserWarning="true" />
        <Route path={routeconfig.globalstepg} component={StepG} showWarning="true" showBrowserWarning="true" />
        <Route path={routeconfig.globalsteph} component={StepH} disableBackClick={true} />
        <Route path={routeconfig.globalstepi} component={StepI} showWarning="true" showBrowserWarning="true" />
        <Route path={routeconfig.updatepasswordnow} component={UpdatePasswordNow} />
        <Route path={routeconfig.updatepassword} component={UpdatePassword} />

        <Route path={routeconfig.electronicgiftsdetail} component={ElectronicGiftsDetail} />
        <Route path={routeconfig.bonusdetail} component={BonusDetail} />
        <Route path={routeconfig.personalpurchasesdetail} component={PersonalPurchasesDetail} />
        <Route path={routeconfig.physicalgiftsdetail} component={PhysicalGiftsDetail} />
        <Route path={routeconfig.statementaccountsummary} component={StatementAccountSummary} requiresUser="true" />
        <Route path={routeconfig.statementpartialtransference} component={StatementPartialTransference} />
        <Route path={routeconfig.partialtransference} component={PartialTransference} showWarning="true" requiresUser="true" />
        <Route path={routeconfig.partialconfirmation} component={PartialConfirmation} requiresUser="true" />
        <Route path={routeconfig.closuretransference} component={ClosureTransference} showWarning="true" requiresUser="true" />
        <Route path={routeconfig.closureconfirmation} component={ClosureConfirmation} requiresUser="true" />

        <Route path={routeconfig.PredeterminedLists} component={PredeterminedLists} />
        <Route path={routeconfig.PredeterminedListsDetailsWeb} component={PredeterminedListsDetailsWeb} />
        <Route path={routeconfig.reportsummary} component={ReportSummary} />
        <Route path={routeconfig.AddBallotModal} component={AddBallotModal} />
        <Route path={routeconfig.DeleteBallotModal} component={DeleteBallotModal} />
        <Route path={routeconfig.downloadPdf} component={DownloadPdf} />
        <Route path={routeconfig.searchforreturn} component={SearchForReturn} requiresUser="true" />
        <Route path={routeconfig.RefundsLandingPage} component={RefundsLandingPage} requiresUser="true" />
        <Route path={routeconfig.ReturnRefundConfirmation} component={ReturnRefundConfirmation} requiresUser="true" />

      </Route>

      <Route path={routeconfig.healthcheck} component={HealthCheck} />
      <Route path={routeconfig.instancecheck} component={InstanceCheck} />
      <Route path={routeconfig.deletecache} component={DeleteCache} />
      <Route path={routeconfig.flushcache} component={FlushCache} />
    </div>
  )
