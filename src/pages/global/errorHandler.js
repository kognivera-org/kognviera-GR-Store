export default (dispatch, error, actionType) => {
    const errorData = error && error.response && error.response.data ? error.response.data : undefined;
    const errorStatus = {
        "status": {
            "status": "failure",
            "errorCode": errorData && errorData.statusCode ? errorData.statusCode : '',
            "errorMessage": errorData && errorData.message ? errorData.message : ''
        }
    }
    dispatch({ type: actionType, payload: errorStatus.status })
}