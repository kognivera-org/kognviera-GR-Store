const initialState = {
  updating: false,
  creating: false,
  completed: false,
  eventDateSaved: false,
  dilisaCheckBox: false,
  fetchingEventTypes: false,
  //   eventOwnerSaved: false,
  //   eventCoownerSaved: false,
  employeeCardData: [],
  data: {},
  error: null,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SELECT_EVENT_TYPE':
      return {
        ...state,
        eventData: { ...state.eventData, ...action.payload },
        validateAccError: undefined,
      }
    case 'EVENT_CATEGORIES':
      return {
        ...state,
        fetchingEventCategories: true,
        fetchedCategoryCategories: false,
        eventCategoryError: null,
      }
    case 'EVENT_CATEGORIES_SUCCESS':
      return {
        ...state,
        eventCategories: action.payload,
        fetchingEventCategories: false,
        fetchedCategoryCategories: true,
        eventCategoryError: null,
      }
    case 'EVENT_CATEGORIES_FAILURE':
      return {
        ...state,
        fetchingEventCategories: false,
        fetchedCategoryCategories: false,
        // eventData: null,
        eventCategoryError: action.payload,
      }
    case 'CATEGORY_EVENTS':
      return {
        ...state,
        eventTypes: null,
        fetchingEventTypes: true,
        fetchedCategoryEvents: false,
        eventTypeError: null,
      }
    case 'CATEGORY_EVENTS_SUCCESS':
      return {
        ...state,
        eventTypes: action.payload,
        fetchingEventTypes: false,
        fetchedCategoryEvents: true,
        eventTypeError: null,
      }
    case 'CATEGORY_EVENTS_FAILURE':
      return {
        ...state,
        fetchingEventTypes: false,
        fetchedCategoryEvents: false,
        // eventData: null,
        eventTypeError: action.payload,
      }
    case 'GETCONTRACTDETAILS':
      return {
        ...state,
      }
    case 'GETCONTRACTDETAILS_SUCCESS':
      return {
        ...state,
        data: action.payload,
        error: undefined,
      }
    case 'GETCONTRACTDETAILS_FAILURE':
      return {
        ...state,
        error: action.payload,
      }


    case 'CREATE_EVENT':
      return {
        ...state,
        updating: true,
        completed: false,
        eventCreated: false,
        createEventError: null,
      }
    case 'CREATE_EVENT_SUCCESS':
      return {
        ...state,
        updating: false,
        completed: true,
        eventCreated: true,
        eventData: { ...state.eventData, ...action.payload },
      }
    case 'CREATE_EVENT_FAILURE':
      return {
        ...state,
        updating: false,
        completed: true,
        // eventData: null,
        eventCreated: false,
        createEventError: action.payload,
      }
    case 'UPDATE_OWNER_EMAIL':
      return {
        ...state,
        ownerEmail: null,
      }
    case 'UPDATE_OWNER_EMAIL_SUCCESS':
      return {
        ...state,
        ownerEmail: action.payload,
      }
    case 'UPDATE_COOWNER_EMAIL':
      return {
        ...state,
        coownerEmail: null,
      }
    case 'UPDATE_COOWNER_EMAIL_SUCCESS':
      return {
        ...state,
        coownerEmail: action.payload,
      }
    case 'UPDATE_COOWNER2_EMAIL':
      return {
        ...state,
        coowner2Email: null,
      }
    case 'UPDATE_COOWNER2_EMAIL_SUCCESS':
      return {
        ...state,
        coowner2Email: action.payload,
      }
    case 'VALIDATE_OWNER':
      return {
        ...state,
        eventData: {
          ...state.eventData,
          ownerInfo: null,
          ownerSaved: false,
          coownerSaved: false,
        },
        ownerCreated: false,
        coownerCreated: false,
        isValidOwner: false,
        validatingOwner: true,
        validateAccError: null,
      }

    case 'ENABLE_SAVE_BUTTON':
      return {
        ...state,
        eventData: {
          ...state.eventData,
          ownerSaved: false,
          coownerSaved: false,
        },
        ownerCreated: false,
        coownerCreated: false,
      }
    case 'VALIDATE_OWNER_SUCCESS':
      return {
        ...state,
        isValidOwner: true,
        eventData: {
          ...state.eventData,
          ownerInfo: action.payload,
        },
        validatingOwner: false,
        ownerProfileError: null,
      }
    case 'VALIDATE_OWNER_FAILURE':
      return {
        ...state,
        isValidOwner: false,
        validatingOwner: false,
        validateAccError: action.payload,
      }

    case 'VALIDATE_COOWNER':
      return {
        ...state,
        eventData: {
          ...state.eventData,
          coownerInfo: null,
          coownerSaved: false,
        },
        coownerCreated: false,
        isValidCoowner: false,
        validatingCoowner: true,
        validateCoownerError: null,
      }
    case 'VALIDATE_COOWNER_SUCCESS':
      return {
        ...state,
        isValidCoowner: true,
        eventData: {
          ...state.eventData,
          coownerInfo: action.payload,
        },
        validatingCoowner: false,
      }
    case 'VALIDATE_COOWNER_FAILURE':
      return {
        ...state,
        isValidCoowner: false,
        validatingCoowner: false,
        validateCoownerError: action.payload,
      }
    case 'VALIDATE_COOWNER2':
      return {
        ...state,
        eventData: {
          ...state.eventData,
          coowner2Info: null,
          coowner2Saved: false,
        },
        coowner2Created: false,
        isValidCoowner2: false,
        validatingCoowner2: true,
        validateCoowner2Error: null,
      }
    case 'VALIDATE_COOWNER2_SUCCESS':
      return {
        ...state,
        isValidCoowner2: true,
        eventData: {
          ...state.eventData,
          coowner2Info: action.payload,
        },
        validatingCoowner2: false,
      }
    case 'VALIDATE_COOWNER2_FAILURE':
      return {
        ...state,
        isValidCoowner2: false,
        validatingCoowner2: false,
        validateCoowner2Error: action.payload,
      }
    case 'COOWNER_ELIGIBLE':
      return {
        ...state,
        isCoownerEligible: false,
        validatingCoownerEligiblity: true,
        CoownerEligibilityError: null,
      }
    case 'COOWNER_ELIGIBLE_SUCCESS':
      return {
        ...state,
        isCoownerEligible: true,
        eventData: {
          ...state.eventData,
          coownerEligible: action.payload,
        },
        validatingCoownerEligiblity: false,
      }
    case 'COOWNER_ELIGIBLE_FAILURE':
      return {
        ...state,
        isCoownerEligible: false,
        validatingCoownerEligiblity: false,
        CoownerEligibilityError: action.payload,
      }
    case 'COOWNER2_ELIGIBLE':
      return {
        ...state,
        isCoowner2Eligible: false,
        validatingCoowner2Eligiblity: true,
        Coowner2EligibilityError: null,
      }
    case 'COOWNER2_ELIGIBLE_SUCCESS':
      return {
        ...state,
        isCoowner2Eligible: true,
        eventData: {
          ...state.eventData,
          coowner2Eligible: action.payload,
        },
        validatingCoowner2Eligiblity: false,
      }
    case 'COOWNER2_ELIGIBLE_FAILURE':
      return {
        ...state,
        isCoowner2Eligible: false,
        validatingCoowner2Eligiblity: false,
        Coowner2EligibilityError: action.payload,
      }

    case 'OWNER_ELIGIBLE':
      return {
        ...state,
        isOwnerEligible: false,
        validatingOwnerEligiblity: true,
        OwnerEligibilityError: null,
      }
    case 'OWNER_ELIGIBLE_SUCCESS':
      return {
        ...state,
        isOwnerEligible: true,
        eventData: {
          ...state.eventData,
          ownerEligible: action.payload,
        },
        validatingOwnerEligiblity: false,
      }
    case 'OWNER_ELIGIBLE_FAILURE':
      return {
        ...state,
        isOwnerEligible: false,
        validatingOwnerEligiblity: false,
        OwnerEligibilityError: action.payload,
      }

    case 'CREATE_PROFILE':
      return {
        ...state,
        ownerCreated: false,
        creatingOwner: true,
      }
    case 'CREATE_PROFILE_SUCCESS':
      return {
        ...state,
        ownerCreated: true,
        eventData: {
          ...state.eventData,
          ownerInfo: action.payload,
        },
        creatingOwner: false,
        ownerProfileError: null,
      }
    case 'CREATE_PROFILE_FAILURE':
      return {
        ...state,
        ownerCreated: false,
        creatingOwner: false,
        ownerProfileError: action.payload,
      }

    case 'CREATE_COOWNER':
      return {
        ...state,
        coownerCreated: false,
        creatingCoowner: true,
      }
    case 'CREATE_COOWNER_SUCCESS':
      return {
        ...state,
        coownerCreated: true,
        eventData: {
          ...state.eventData,
          coownerInfo: action.payload,
        },
        creatingCoowner: false,
        coownerProfileError: null,
      }
    case 'CREATE_COOWNER_FAILURE':
      return {
        ...state,
        coownerCreated: false,
        creatingCoowner: false,
        coownerProfileError: action.payload,
      }
    case 'CREATE_COOWNER2':
      return {
        ...state,
        coowner2Created: false,
        creatingCoowner2: true,
      }
    case 'CREATE_COOWNER2_SUCCESS':
      return {
        ...state,
        coowner2Created: true,
        eventData: {
          ...state.eventData,
          coowner2Info: action.payload,
        },
        creatingCoowner2: false,
        coowner2ProfileError: null,
      }
    case 'CREATE_COOWNER2_FAILURE':
      return {
        ...state,
        coowner2Created: false,
        creatingCoowner2: false,
        coowner2ProfileError: action.payload,
      }
    case 'VALIDATE_EVENT_NAME':
      return {
        ...state,
        isValidEvent: false,
        eventNameError: null,
      }
    case 'VALIDATE_EVENT_NAME_SUCCESS':
      return {
        ...state,
        isValidEvent: true,
        eventData: {
          ...state.eventData,
          ...action.payload,
        },
        eventNameError: undefined,
      }
    case 'VALIDATE_EVENT_NAME_FAILURE':
      return {
        ...state,
        isValidEvent: false,
        eventNameError: action.payload,
      }
    case 'UPDATE_OWNER_DATA':
      return {
        ...state,
        eventOwnerSaved: false,
      }
    case 'UPDATE_OWNER_DATA':
      return {
        ...state,
        ownerSaved: false,
        eventOwnerSaved: false,
      }
    case 'UPDATE_OWNER_DATA_SUCCESS':
      return {
        ...state,
        eventData: {
          ...state.eventData,
          ownerSaved: true,
          ownerInfo: action.payload,
        },
        eventOwnerSaved: true,
      }
    case 'UPDATE_COOWNER_DATA':
      return {
        ...state,
        coownerSaved: false,
      }
    case 'UPDATE_COOWNER_DATA_SUCCESS':
      return {
        ...state,
        eventData: {
          ...state.eventData,
          coownerSaved: true,
          coownerInfo: action.payload,
        },
      }
    case 'UPDATE_COOWNER2_DATA':
      return {
        ...state,
        coowner2Saved: false,
      }
    case 'UPDATE_COOWNER2_DATA_SUCCESS':
      return {
        ...state,
        eventData: {
          ...state.eventData,
          coowner2Saved: true,
          coowner2Info: action.payload,
        },
      }
    case 'UPDATE_EVENT_ADDRESSES':
      return {
        ...state,
        eventData: {
          ...state.eventData,
          eventAddresses: action.payload,
        },
      }
    case 'UPDATE_PREFERRED_DAYS':
      return {
        ...state,
        eventData: {
          ...state.eventData,
          deliveryPreferences: action.payload,
        },
      }

    case 'FLUSH_PREFERRED_DAYS':
      return {
        ...state,
        eventData: {
          ...state.eventData,
          deliveryPreferences: null,
        },
      }
    case 'FLUSH_CREATEEVENT_DATA':
      return initialState
    case 'RESET_EVENT_DATA':
      return {
        ...initialState,
        eventCategories: state.eventCategories,
        eventTypes: state.eventTypes,
      }
    case 'UPDATE_EMPLOYEE_CARD_DETAILS':
      return {
        ...state,
        eventData: {
          ...state.eventData,
          employeeCardData: action.payload,
        },
        error: undefined,
      }

    case 'GET_CREDIT_CARD_SUCCESS':
      return {
        ...state,
        eventData: {
          ...state.eventData,
          creditCardDetails: action.payload,
        },
        creditCardDetailsError: undefined,
      }

    case 'FLUSH_DILISA_CARD':
      return {
        ...state,
        eventData: {
          ...state.eventData,
          employeeCardData: null,
          dilisaCardFlushed: true,
        },
        error: undefined,
      }

    case 'HANDLE_CHECKED_CHECKBOX':
      return {
        ...state,
        dilisaCheckBox: true,
      }

    case 'HANDLE_UNCHECKED_CHECKBOX':
      return {
        ...state,
        dilisaCheckBox: false,
      }

    case 'GET_CREDIT_CARD_FAILURE':
      return {
        ...state,
        eventData: {
          ...state.eventData,
          creditCardDetails: undefined,
        },
        creditCardDetailsError: action.payload,
      }

    default:
      return state
  }

}
