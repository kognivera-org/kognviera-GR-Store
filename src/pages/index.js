// Global
export Header from './global/Header'

// Login
export LoginPage from './login/LoginPage'

export UpdatePassword from './login/UpdatePassword'
export UpdatePasswordNow from './login/UpdatePassword/UpdatePasswordNow'
// Dashboard
// - includes
export MainDashboard from './browse/MainDashboard'
export MesaActions from './browse/MainDashboard/components/MesaActions'
export ActivityLog from './browse/MainDashboard/components/ActivityLog'
export Reminders from './browse/MainDashboard/components/Reminders'
// - links
export DayTracker from './browse/DayTracker'

export PersonalPurchase from './eventGiftList/personalPurchase';
export RegisterModal from './eventGiftList/registeredGifts/modals/registerModal';
export SuccessRegisterModal from './eventGiftList/registeredGifts/modals/successRegisterModal';
export RegisteredGifts from './eventGiftList/registeredGifts';

// event management
export EventManagementContract from './eventManagement/Contract'
export EventDashboard from './eventManagement/EventDashboard'
export Preferences from './eventManagement/DeliveryPreferences'
export AddNewEmployeeCard from './eventManagement/EmployeeCards/AddNewEmployeeCard'
export EditEmployeeCard from './eventManagement/EmployeeCards/EditEmployeeCard'
export EmployeeCards from './eventManagement/EmployeeCards/EmployeeCards'
export AddNewAddress2 from './eventManagement/EventAddress/AddNewAddress'
export EditAddress2 from './eventManagement/EventAddress/EditAddress'
export EventAddressInfo from './eventManagement/EventAddress/EventAddressInfo'
export EditEventInfo from './eventManagement/EventData/EditEventInfo'
export AddEventInfo from './eventManagement/EventData/AddEventInfo'
export EventGralInfo from './eventManagement/EventData/EventGralInfo'
export CalendarModal from './eventManagement/EventData/modal/CalendarModal'
export PermissionsModal from './eventManagement/EventData/modal/PermissionsModal'
export StoreModal from './eventManagement/EventData/modal/StoreModal'
export Movements from './eventManagement/history/Movements'
export VerificationDocuments from './eventManagement/VerificationDocuments'


export EventDetails from './eventSearch/EventDetails'
export EventSearchResults from './eventSearch/EventSearchResults'

// changeOfEvent
export AddNewManager from './changeOfEvent/AddNewManager'
export CelebratedCardInfo from './changeOfEvent/CelebratedCardInfo'
export ChangeOfEvent from './changeOfEvent/ChangeOfEvent'
export EventContract from './changeOfEvent/Contract'
export EventInfo from './changeOfEvent/EventInfo'
export SelectAddress from './changeOfEvent/SelectAddress'
export SelectAddress2 from './changeOfEvent/SelectAddress2'
export SelectedCelebrated from './changeOfEvent/SelectedCelebrated'
export SelectEventType from './changeOfEvent/SelectEventType'

export StepA from './createevent/globalevent/StepA'
export StepB from './createevent/globalevent/StepB'
export StepC from './createevent/globalevent/StepC'
export StepD from './createevent/globalevent/StepD'
export StepE from './createevent/globalevent/StepE'
export StepF from './createevent/globalevent/StepF'
export StepG from './createevent/globalevent/StepG'
export StepH from './createevent/globalevent/StepH'
export StepI from './createevent/globalevent/StepI'
export AddNewAddress from './createevent/address/AddNewAddress'
export AddNewCreditCard from './createevent/employeeCreditCardInfo/AddNewCreditCard'

// Account Statement, Partial Transference, Closure
export ElectronicGiftsDetail from './accountSummary/components/ElectronicGiftsDetail'
export BonusDetail from './accountSummary/components/BonusDetail'
export PersonalPurchasesDetail from './accountSummary/components/PersonalPurchasesDetail'
export PhysicalGiftsDetail from './accountSummary/components/PhysicalGiftsDetail'
export StatementAccountSummary from './accountSummary/components/StatementAccountSummary'
export ReportSummary from './reports/ReportSummary';
export StatementPartialTransference from './accountSummary/components/StatementPartialTransference';
export PartialTransference from './accountSummary/components/PartialTransference';
export PartialConfirmation from './accountSummary/components/PartialTransference/PartialConfirmation';
export ClosureTransference from './accountSummary/components/ClosureTransference';
export ClosureConfirmation from './accountSummary/components/ClosureTransference/ClosureConfirmation';

// export Intransitmodal from './accountSummary/components/intransitmodal';
// export statementpartialtransference from './accountSummary/components/statementpartialtransference';
export PredeterminedLists from './eventGiftList/adminRegisteredGifts/PredeterminedLists'
export PredeterminedListsDetailsWeb from './eventGiftList/adminRegisteredGifts/PredeterminedLists/components/PredeterminedListsDetailsWeb'

// Giftlist management
// export ReceivedGifts from './eventGiftList/receivedGifts';||||||| .r4075

// Giftlist management
export ReceivedGifts from './eventGiftList/receivedGifts';
// export EventDetails from './eventSearch/EventDetails/EventDetails';
// Giftlist management
export DownloadPdf from '../components/DownloadPdf';

// return and refund
export SearchForReturn from './return/SearchForReturn';
export RefundsLandingPage from './return/RefundsLandingPage';
export ReturnRefundConfirmation from './accountSummary/components/PartialTransference/ReturnRefundConfirmation';

export DeleteCache from './global/Utilities/CacheControls/DeleteCache';
export FlushCache from './global/Utilities/CacheControls/FlushCache';
export HealthCheck from './global/Utilities/HealthCheck';
export InstanceCheck from './global/Utilities/InstanceCheck';