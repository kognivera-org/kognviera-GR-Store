const initialState = {
  loading: false,
  nickname: false,
  addressSearch: {},
  addressAdded: false,
  error: {},
  ownerAddresses: [],
  data: [],
}
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'ADD_ADDRESS':
      return {
        ...state,
        loading: true,
        addressAdded: false,
        nickname: false,
        error: null,
      }

    case 'ADD_ADDRESS_SUCCESS':
      return {
        ...state,
        data: [...state.data, action.payload],
        // data: action.payload,
        loading: false,
        nickname: true,
        addressAdded: true,
        error: undefined,
      }

    case 'ADD_ADDRESS_FAILURE':
      return {
        ...state,
        loading: false,
        nickname: false,
        addressAdded: false,
        error: action.payload,
      }
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        loading: true,
        addressAdded: false,
        nickname: false,
        error: null,
      }

    case 'UPDATE_ADDRESS_SUCCESS':
      return {
        ...state,
        data: [...state.data, action.payload],
        // data: action.payload,
        loading: false,
        nickname: true,
        addressAdded: true,
        error: undefined,
      }

    case 'UPDATE_ADDRESS_FAILURE':
      return {
        ...state,
        loading: false,
        nickname: false,
        addressAdded: false,
        error: action.payload,
      }

    case 'GETADDRESSSEARCH':
      return {
        ...state,
        addressSearchLoading: true,
        sepomexisError: null,
        addressSearch: {},
      }
    case 'GETADDRESSSEARCH_SUCCESS':
      return {
        ...state,
        addressSearchLoading: false,
        addressSearch: action.payload,
        sepomexisError: null,
        error: null,
      }

    case 'FLUSH_ADDRESS_SEARCH':
      return {
        ...state,
        addressSearchLoading: false,
        addressSearch: {},
        sepomexisError: null,
      }

    case 'GETADDRESSSEARCH_FAILURE':
      return {
        ...state,
        addressSearchLoading: false,
        sepomexisError: action.payload,
        addressSearch: {},
      }

    case 'RESET_ADDRESS_LIST': return {
      ...state,
      ownerAddresses: [],
    }

    case 'FETCH_OWNER_ADDRESSES':
      return {
        ...state,
        fetchingOwnerAddresses: true,
      }
    case 'FLUSH_CREATEEVENT_DATA':
      return initialState
    case 'FETCH_OWNER_ADDRESSES_SUCCESS':
      const addressArr = action.payload.addresses ? action.payload.addresses : []
      return {
        ...state,
        fetchingOwnerAddresses: false,
        ownerAddresses: [...state.ownerAddresses, ...addressArr],
        ownerAddressesError: undefined,
      }

    case 'FETCH_OWNER_ADDRESSES_FAILURE':
      return {
        ...state,
        fetchingOwnerAddresses: false,
        ownerAddressesError: action.payload,
      }


    case 'FETCH_COOWNER_ADDRESSES':
      return {
        ...state,
        fetchingCoownerAddresses: true,
      }

    case 'FETCH_COOWNER_ADDRESSES_SUCCESS':
      return {
        ...state,
        fetchingCoownerAddresses: false,
        coownerAddresses: action.payload,
        coownerAddressesError: undefined,
      }

    case 'FETCH_COOWNER_ADDRESSES_FAILURE':
      return {
        ...state,
        fetchingCoownerAddresses: false,
        coownerAddresses: null,
        coownerAddressesError: action.payload,
      }

    default: return state
  }
}
