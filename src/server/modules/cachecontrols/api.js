import Joi from 'joi'
import { server } from 'hails'
import _ from 'lodash';
import serverUtils from '../../utils/serverUtils'
import cacheUtils from '../../utils/cacheUtils'
import log from '../../utils/logUtils'

module.exports = function () {
    return [
      {
        method: 'GET',
        path: '/api/flushcache',
        handler: async (request, reply) => {
            try {
                const response = await cacheUtils.flush();
                log.debug('Flush completed response :: ', response);
                return reply.response({
                    status: {
                        status: 'success',
                    },
                    data: { ...response }
                });
            } catch (error) {
                return reply.response({
                    status: {
                        status: 'failure',
                        errorCode: '999',
                        errorMessage: 'Error Occured while flushing cache.'
                    }
                });
            }
        },
        options: {
          tags: ['api'],
        }
      },{
        method: 'GET',
        path: '/api/deletecache',
        handler: async (request, reply) => {
            try {
                const key = request.query.key;
                const response = await cacheUtils.delete(key);
                log.debug('Deletecache for', key, 'completed. :: ', response);
                return reply.response({
                    status: {
                        status: 'success',
                    },
                    data: { ...response }
                });
            } catch (error) {
                return reply.response({
                    status: {
                        status: 'failure',
                        errorCode: '999',
                        errorMessage: 'Error Occured while flushing cache.'
                    }
                });
            }
        },
        options: {
          tags: ['api'],
        }
      },
    ]
}