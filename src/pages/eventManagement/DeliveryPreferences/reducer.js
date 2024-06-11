import {
    GET_PEREFERENCE_DELIVERY_ADDRESS,
    GET_PEREFERENCE_DELIVERY_ADDRESS_SUCCESS,
    GET_PEREFERENCE_DELIVERY_ADDRESS_ERROR,
    SAVE_PEREFERENCE_DELIVERY_ADDRESS,
    SAVE_PEREFERENCE_DELIVERY_ADDRESS_SUCCESS,
    SAVE_PEREFERENCE_DELIVERY_ADDRESS_ERROR,
} from './action'

const initialState = {
  preferenceDeliveryAddressLoading: false,
  savingPreferenceDeliveryAddressLoading: false,
  preferenceDeliveryAddress: null,
  isUpdatedSuccessFully: false,
  preferenceDeliveryAddressError: null,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_PEREFERENCE_DELIVERY_ADDRESS: return {
      ...state,
      preferenceDeliveryAddress: null,
      preferenceDeliveryAddressLoading: true,
      isUpdatedSuccessFully: false,
    }
    case GET_PEREFERENCE_DELIVERY_ADDRESS_SUCCESS: return {
      ...state,
      preferenceDeliveryAddressLoading: false,
      preferenceDeliveryAddress: action.payload,
      preferenceDeliveryAddressError: null,
    }
    case GET_PEREFERENCE_DELIVERY_ADDRESS_ERROR: return {
      ...state,
      preferenceDeliveryAddressLoading: false,
      preferenceDeliveryAddress: null,
      preferenceDeliveryAddressError: action.payload,
    }
    case SAVE_PEREFERENCE_DELIVERY_ADDRESS: return {
      ...state,
      savingPreferenceDeliveryAddressLoading: true,
    }
    case SAVE_PEREFERENCE_DELIVERY_ADDRESS_SUCCESS: return {
      ...state,
      savingPreferenceDeliveryAddressLoading: false,
      preferenceDeliveryAddress: {
        ...state.preferenceDeliveryAddress,
        deliveryDayAndAddressInfo: action.payload,
      },
      isUpdatedSuccessFully: true,
      preferenceDeliveryAddressError: null,
    }
    case SAVE_PEREFERENCE_DELIVERY_ADDRESS_ERROR: return {
      ...state,
      preferenceDeliveryAddressLoading: false,
      preferenceDeliveryAddress: null,
      preferenceDeliveryAddressError: action.payload,
    }
    default:
      return state
  }
}
