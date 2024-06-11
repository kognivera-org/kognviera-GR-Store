const initialState = {
  error: undefined,
  returnList: undefined
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'CLEAR_SEARCH':
      return {
        ...state,
        error: undefined,
        returnList: {},
        loadingData: false
      }
    case 'INITIATE_RETURN_LIST_SUCCESS':
      return {
        ...state,
        error: undefined,
        returnList: { ...state.data, ...action.payload },
        loadingData: false
      }
    case 'INITIATE_RETURN_LIST_FAILURE':
      return {
        ...state,
        error: action.payload,
        loadingData: false
      };

    case 'INITIATE_RETURN_LIST':
      return {
        ...state,
        loadingData: true
      };

    case 'DELETE_RETURN_LIST_SUCCESS':
      const payload = action.payload;
      payload && delete payload.failedReturnItemsInfo;
      return {
        ...state,
        error: undefined,
        returnList: { ...state.data, ...action.payload },
        loadingData: false
      }
    case 'DELETE_RETURN_LIST_FAILURE':
      return {
        ...state,
        error: action.payload,
        loadingData: false
      };

    case 'DELETE_RETURN_LIST':
      return {
        ...state,
        loadingData: true
      };

    // case 'DELETE_INVALID_RETURN_LIST':
    //   console.log('state.returnList', state.returnList);
    //   console.log('action.payload', action.payload);
    //   const failed = state.returnList.failedReturnItemsInfo && state.returnList.failedReturnItemsInfo.filter(product => product.skuId != action.payload.skuId)
    //   console.log('failed', failed);
    //   return {
    //     ...state,
    //     returnList: failed
    //   };

    default:
      return state
  }

}  
