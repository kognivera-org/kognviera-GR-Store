import 'babel-polyfill'
import axios from 'axios'
import API_MAP from '../../../endpoints'
import config from 'config/appconfig'

export function getLabels(debug) {
    return {
        types: ['LABELS', 'LABELS_SUCCESS', 'LABELS_FAILURE'],
        ping: client => client.post(API_MAP.labels_url, {
            data: {
                // channel: "INSTORE",
                // brand: "LP",
                pageNames: config.labelPageNames,
                debug
            }
        })
    }
}
//export default getLabels;