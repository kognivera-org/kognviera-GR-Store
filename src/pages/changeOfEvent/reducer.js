const initialState = {
    // updating: false,
    // creating: false,
    // completed: false,
    // eventDateSaved: false,
    // //   eventOwnerSaved: false,
    // //   eventCoownerSaved: false,
    // employeeCardData: [],
  addedCoowner: [],
  deletedCelebrityInfo: [],
  data: {},
  error: null,
}
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'VALIDATE_COOWNER_ELIGIBILITY':
      return {
        ...state,
        eligibilityValidationLoading: true,
        eligibilityValidationError: null,
        eligibilityValidationSuccess: null,
      }
    case 'VALIDATE_COOWNER_ELIGIBILITY_SUCCESS':
      return {
        ...state,
        eligibilityValidationLoading: false,
        eligibilityValidationSuccess: action.payload,
        eligibilityValidationError: null,
      }
    case 'VALIDATE_COOWNER_ELIGIBILITY_FAILURE':
      return {
        ...state,
        eligibilityValidationLoading: false,
        eligibilityValidationError: action.payload,
        eligibilityValidationSuccess: null,
      }
    case 'VALIDATE_COOWNER2_ELIGIBILITY':
      return {
        ...state,
        eligibilityValidation2Loading: true,
        eligibilityValidation2Error: null,
        eligibilityValidation2Success: null,
      }
    case 'VALIDATE_COOWNER2_ELIGIBILITY_SUCCESS':
      return {
        ...state,
        eligibilityValidation2Loading: false,
        eligibilityValidation2Success: action.payload,
        eligibilityValidation2Error: null,
      }
    case 'VALIDATE_COOWNER2_ELIGIBILITY_FAILURE':
      return {
        ...state,
        eligibilityValidation2Loading: false,
        eligibilityValidation2Error: action.payload,
        eligibilityValidation2Success: null,
      }
    case 'VALIDATE_REQUIRED_OWNER':
      return {
        ...state,
        validationLoading: true,
        validationRequired: null,
        validationRequiredError: null,
      }
    case 'VALIDATE_REQUIRED_OWNER_SUCCESS':
      return {
        ...state,
        validationLoading: false,
        validationRequired: action.payload,
      }
    case 'VALIDATE_REQUIRED_OWNER_FAILURE':
      return {
        ...state,
        validationLoading: false,
        validationRequiredError: action.payload,
      }
    case 'UPDATE_EVENT_TYPE':
      return {
        ...state,
        UpdatingEventType: true,
        eventTypeUpdated: null,
        eventTypeUpdatedError: null,
      }
    case 'UPDATE_EVENT_TYPE_SUCCESS':
      return {
        ...state,
        UpdatingEventType: false,
        eventTypeUpdated: action.payload,
      }
    case 'UPDATE_EVENT_TYPE_FAILURE':
      return {
        ...state,
        UpdatingEventType: false,
        eventTypeUpdatedError: action.payload,
      }
    case 'CELEBRITY_INFO_DATA':
      return {
        ...state,
        celebrityInfoUpdating: true,
        celebrityInfo: null,
      }
    case 'CELEBRITY_INFO_DATA_SUCCESS':
      return {
        ...state,
        celebrityInfoUpdating: false,
        celebrityInfo: action.payload,
      }
    case 'CELEBRITY_INFOS_DATA':
      return {
        ...state,
        celebrityInfosUpdating: true,
        celebrityInfos: null,
      }
    case 'CELEBRITY_INFOS_DATA_SUCCESS':
      return {
        ...state,
        celebrityInfosUpdating: false,
        celebrityInfos: action.payload,
      }
    case 'DELETED_CELEBRITY_INFO_DATA':
      return {
        ...state,
      }
    case 'DELETED_CELEBRITY_INFO_DATA_SUCCESS':
      return {
        ...state,
        deletedCelebrityInfo: [...state.deletedCelebrityInfo, ...action.payload],
      }
    case 'UPDATE_EVENT_ADDRESS':
      return {
        ...state,
        AddressInfo: null,
      }
    case 'UPDATE_EVENT_ADDRESS_SUCCESS':
      return {
        ...state,
        AddressInfo: action.payload,
      }
    case 'DELETED_EVENT_ADDRESS':
      return {
        ...state,
        deletedAddressInfo: null,
      }
    case 'DELETED_EVENT_ADDRESS_SUCCESS':
      return {
        ...state,
        deletedAddressInfo: action.payload,
      }
    case 'UPDATE_PLASTIC_CARDS':
      return {
        ...state,
        PlasticCardsInfo: null,
      }
    case 'FLUSH_CHANGEOFEVENT_DATA':
      return initialState
    case 'UPDATE_PLASTIC_CARDS_SUCCESS':
      return {
        ...state,
        PlasticCardsInfo: action.payload,
      }
    case 'FLUSH_PLASTICCARD_DATA':
      return {
        ...state,
        PlasticCardsInfo: null,
      }
    case 'DELETED_PLASTIC_CARDS':
      return {
        ...state,
        deletedPlasticCardsInfo: null,
      }
    case 'DELETED_PLASTIC_CARDS_SUCCESS':
      return {
        ...state,
        deletedPlasticCardsInfo: action.payload,
      }
    case 'ADD_COOWNER':
      return {
        ...state,
        AddingCoowner: true,
      }
    case 'ADD_COOWNER_SUCCESS':
      return {
        ...state,
        addedCoowner: [...state.addedCoowner, ...action.payload],
        AddingCoowner: false,
      }
    case 'UPDATE_ADD_COOWNER':
      return {
        ...state,
      }
    case 'UPDATE_ADD_COOWNER_SUCCESS':
      return {
        ...state,
        addedCoowner: action.payload,
      }
    default:
      return state
  }
}
