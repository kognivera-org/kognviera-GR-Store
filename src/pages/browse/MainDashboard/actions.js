import 'babel-polyfill'
import axios from 'axios'
import API_MAP from 'endpoints'

export function loadActivityLogs(performedUserId, viewCompleteLog, filterParam) {
    return {
        types: ['LOAD_ACTIVITY_LOGS', 'LOAD_ACTIVITY_LOGS_SUCCESS', 'LOAD_ACTIVITY_LOGS_FAIL'],
        ping: client => client.post(API_MAP.get_activity_logs_url, {
            data: {
                // channel: 'INSTORE',
                // brand: 'LP',
                performedUserId,
                viewCompleteLog,
                filterParam: filterParam === null ? undefined : filterParam,
            }
        })
    }
}
