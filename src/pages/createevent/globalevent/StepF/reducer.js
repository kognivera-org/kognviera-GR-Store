const initialState = {
  data: {},
  error: {},
}
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'PREFFERED_DELIVERY_DAYS':
      return {
        ...state,
      }
    case 'PREFFERED_DELIVERY_DAYS_SUCCESS':
      return {
        ...state,
        data: action.payload,
        error: undefined,
      }
    case 'PREFFERED_DELIVERY_DAYS_FAILURE':
      return {
        ...state,
        error: action.payload,
      }
    default:
      return state
  }
}
