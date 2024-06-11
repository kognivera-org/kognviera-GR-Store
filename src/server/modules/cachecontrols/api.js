import Joi from 'joi'
import { server } from 'hails'
import _ from 'lodash';
import serverUtils from '../../utils/serverUtils'
import cacheUtils from '../../utils/cacheUtils'
import log from '../../utils/logUtils'

server.route.get('/api/flushcache', {
    tags: ['api'],
}, async (request, reply) => {
    try {
        const response = await cacheUtils.flush();
        log.debug('Flush completed response :: ', response);
        reply({
            status: {
                status: 'success',
            },
            data: { ...response }
        });
    } catch (error) {
        reply({
            status: {
                status: 'failure',
                errorCode: '999',
                errorMessage: 'Error Occured while flushing cache.'
            }
        });
    }
});

server.route.get('/api/deletecache', {
    tags: ['api'],
}, async (request, reply) => {
    try {
        const key = request.query.key;
        const response = await cacheUtils.delete(key);
        log.debug('Deletecache for', key, 'completed. :: ', response);
        reply({
            status: {
                status: 'success',
            },
            data: { ...response }
        });
    } catch (error) {
        reply({
            status: {
                status: 'failure',
                errorCode: '999',
                errorMessage: 'Error Occured while flushing cache.'
            }
        });
    }
});