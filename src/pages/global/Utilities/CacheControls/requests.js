import API_MAP from '../../../../endpoints';
import commonUtil from '../../../../utils/commonUtil';

export async function flushcache(values, callback) {
    const response = await commonUtil.triggerPostRequest(API_MAP.flushcache, 'POST', values);
    if (typeof callback === 'function') {
        callback(response);
    }
}

export async function deletecache(cacheKey, callback) {
    const response = await commonUtil.triggerPostRequest(API_MAP.deletecache, 'GET', { key: cacheKey });
    if (typeof callback === 'function') {
        callback(response);
    }
}