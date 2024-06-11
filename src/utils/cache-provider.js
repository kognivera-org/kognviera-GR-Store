import commonUtil from '../utils/commonUtil'
import settingsFile from '../../settings'
import os from 'os'
import { preCacheableServices, preCacheableParams } from '../server/config/endpoints/services'
import logger from '../server/utils/logUtils'

const settings = settingsFile[process.env.NODE_ENV]

exports.start = function (done) {
  let output = {}
  output = commonUtil.triggerPostRequest('/api/flushcache', 'POST')

  Object.keys(preCacheableServices).map((key) => {
    const serviceUrl = preCacheableServices[key]
    const serviceParams = preCacheableParams[key]
    logger.info('Pre-caching ', serviceUrl, ' with params ', serviceParams);
    output = commonUtil.triggerPostRequest(`http://${process.env.HOST || os.hostname() || 'localhost'}:${settings.connection.port}${serviceUrl}`, 'POST', serviceParams)
  })
  return done()
}

