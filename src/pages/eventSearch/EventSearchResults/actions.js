import API_MAP from '../../../endpoints'
import axios from 'axios'
import 'babel-polyfill'

const EVENTSEARCH_SUCCESS = 'searchevents/EVENTSEARCH_SUCCESS'
const EVENTSEARCH_FAIL = 'searchevents/EVENTSEARCH_FAIL'
const EVENTSEARCH = 'searchevents/EVENTSEARCH'

export function executeEventSearch(queryString) {
    return {
        types: [EVENTSEARCH, EVENTSEARCH_SUCCESS, EVENTSEARCH_FAIL],
        ping: client => client.get('/api/getEventsBySearchablePropertiesPerStore', {
            params: { ...queryString }
        })
    }
}
