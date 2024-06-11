import Joi from 'joi'
import { server } from 'hails'
import _ from 'lodash';
import serverUtils from '../../utils/serverUtils'

server.route.post('/api/labels', {
    tags: ['api'],
}, (request, reply) => {
    serverUtils.triggerServerRequest({
        request,
        reply,
        transformResponse: (labels) => {
            return labels && {
                ..._.assign.apply(_, _.map(labels.staticLabelValues, 'keyValues')),
                showKey: labels.showKey
            }
        }
    });
}); 