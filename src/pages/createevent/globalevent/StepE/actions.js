

import 'babel-polyfill'

export function updateSelectedAddresses(values) {
    return async (dispatch) => {
        dispatch({ type: 'UPDATE_SELECTED_ADDRESSES', payload: values })
    }
}

export function updateSelectedAssignees(values) {
    return async (dispatch) => {
        dispatch({ type: 'UPDATE_SELECTED_ASSIGNEES', payload: values })
    }
}

export function flushSelectedAssignees() {
    return async (dispatch) => {
        dispatch({ type: 'FLUSH_SELECTED_ASSIGNEES' })
    }
}