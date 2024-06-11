const initialState = {
  loading: false,
  error: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case 'ADD_UPDATE_EMPLOYEE_CARD':
      return {
        ...state,
        loading: true,
        error: undefined
      };
    case 'ADD_UPDATE_EMPLOYEE_CARD_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: undefined,
        success: true,
      };

    case 'ADD_UPDATE_EMPLOYEE_CARD_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        data: undefined,
        success: false,
      };

    case 'GET_EMPLOYEE_CARD_UPDATE':
      return {
        ...state,
        loading: true,
        data: undefined,
        success: false,
      };
    default: return state;
  }
}