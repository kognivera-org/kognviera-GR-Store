import Joi from 'joi'
// import { server } from 'hails'
import _ from 'lodash';
import serverUtils from '../../utils/serverUtils'


module.exports = function () {
    return [
      
        {
            method: 'POST',
            path: '/api/labels',
            handler: async (request, reply) => {

                let res =  await serverUtils.triggerServerRequest({
                    request,
                    reply,
                    transformResponse: (labels) => {
                        labels && {
                            ..._.assign.apply(_, _.map(labels.staticLabelValues, 'keyValues')),
                            showKey: labels.showKey
                        }
                    }

                    
                });

                let resremovalue = res.data && {
                    ..._.assign.apply(_, _.map(res.data.staticLabelValues, 'keyValues')),
                    showKey: res.data.showKey
                }
                //console.log("res1===",res1)
                return  reply.response(resremovalue);

                // let res =  await serverUtils.triggerServerRequest({
                //     request,
                //     reply,
                //     cacheKey: request.payload.searchType
                // });
                // if(res.header)
                //     {
                //         return reply.response(res).header('gr-hostname', res.header)
                         
                //     }
                //     else 
                //     {
                //         return reply.response(res)
                //     }

                //console.log("======,abc===",abc)
            }
            

      }
      
    ]
    
}


// server.route.post('/api/labels', {
//     tags: ['api'],
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//         transformResponse: (labels) => {
//             return labels && {
//                 ..._.assign.apply(_, _.map(labels.staticLabelValues, 'keyValues')),
//                 showKey: labels.showKey
//             }
//         }
//     });
// }); 