import axios from 'axios';
import commonUtils from 'utils/commonUtil';
import uuid from 'uuid/v4';
const methods = ['get', 'post', 'put', 'patch', 'del'];

// redundant to server/server.js
let port;
if (process.env.PORT) {
    port = process.env.PORT;
} else if (DEVELOPMENT) {
    port = 4000;
} else {
    port = 8080;
}

if (SERVER) {
    const settings = require('../../settings');
    port = settings && settings[process.env.NODE_ENV].connection.port;
}

function formatUrl(path) {
    const adjustedPath = path[0] !== '/' ? `/${path}` : path;
    if (SERVER) {
        return `http://${process.env.HOST || os.hostname() || 'localhost'}:${port}${adjustedPath}`;
    }
    // Prepend `/api` to relative URL, to proxy to API server.
    return adjustedPath;
}

export default class AxiosClient {
    constructor(request) {
        methods.forEach(method => (
            this[method] = (path, { params, data, responseType, headers, timeout, onUploadProgress } = {}) => {
                return axios({
                    method: method,
                    url: formatUrl(path),
                    data: data && this.setChannelBrandData(data),
                    params: params && this.setChannelBrandData(params),
                    timeout: timeout || 50000,
                    headers: {
                        'x-correlation-id': uuid(Date.now()),
                        ...headers
                    },
                    responseType: responseType,
                    onUploadProgress
                })

            }
        ))
    }
    static empty() { }

    setChannelBrandData = (data) => {
        const user = commonUtils.getCurrentStoreUser();
        const channel = 'INSTORE';
        let brand = (data && data.brand) || (user && user.brandName) || 'LP';

        const objType = Object.prototype.toString.call(data);
        let ret = data;

        if (objType && objType.includes('FormData')) {
            ret = data;
            ret.append("channel", channel);
            ret.append("brand", brand);
        } else {
            ret = { ...ret, channel, brand };
        }

        return ret;

    }
}