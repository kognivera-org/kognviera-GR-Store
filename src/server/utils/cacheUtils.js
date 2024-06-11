import memjs from 'memjs';
import settingsFile from '../../../settings';
import _ from 'lodash';
import log from './logUtils';
const settings = settingsFile[process.env.NODE_ENV];
const server = settings.endpoints.cache;
const client = memjs.Client.create(server);
const expires = 21600;

const CacheUtils = {

    push(key, value) {
        log.debug('Push to Coherence for key? ::: ', key);
        if (key && value && !_.isEmpty(value)) {
            log.debug('Push to Coherence for ' + key);
            client.set(key, JSON.stringify(value), { expires: expires },
                function (error, value) {
                    if (error) {
                        log.error('Error occured while pushing to Coherence ::: ', error);
                    } else {
                        log.debug('Pushed to Coherence.');
                    }
                }
            );
        }
    },

    get(key) {
        log.debug('Get from Coherence for key ::: ', key)
        return new Promise(function (resolve, reject) {
            client.get(key, function (error, hit) {
                if (error) {
                    log.error("Coherence Get Error ::: ", error)
                    resolve(undefined);
                }
                if (hit) {
                    const cached = hit && hit.toString('utf8');
                    const value = cached && JSON.parse(cached);
                    log.debug("Coherence Hit for key ::: ", key);
                    resolve(hit);
                } else {
                    log.debug("Coherence Miss for key ::: ", key);
                    resolve(undefined);
                }
            });
        });
    },

    flush() {
        log.debug('Flushing entire Coherence Near Cache.');
        return new Promise(function (resolve, reject) {
            client.flush(function (error, results) {
                if (error) {
                    log.error("Coherence Flush Error ::: ", error)
                    reject(error);
                } else {
                    log.debug("Coherence Flushed successfully.");
                    resolve(results);
                }
            });
        });

    },

    delete(key) {
        log.debug('Delete from Coherence for key ::: ', key)
        return new Promise(function (resolve, reject) {
            client.delete(key, function (error, hit) {
                if (error) {
                    log.error("Coherence Delete Error ::: ", error)
                    resolve(undefined);
                }
                if (hit) {
                    log.debug("Coherence Entry Deleted for key ::: ", key);
                    resolve(hit);
                }
            });
        });
    },
}
export default CacheUtils;