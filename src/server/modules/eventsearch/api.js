import Joi from 'joi'
import Boom from 'boom'
import axios from 'axios'
import serverEndpoints from 'server/serverEndpoints';
// import { server, models } from 'hails'
import 'babel-polyfill';
import serverUtils from '../../utils/serverUtils';
module.exports = function () {
    return [
        {
            method: 'GET',
            path: '/api/getEventsBySearchablePropertiesPerStore',
            handler: async (request, reply) => {
                let res =  await serverUtils.triggerServerRequest({
                    request,
                    reply,
                    transformRequest: requestObj => {
                        requestObj.payload = requestObj.query
                        if (!requestObj.payload.closingEndDateRange && requestObj.payload.closingStartDateRange) {
                            requestObj.payload.closingEndDateRange = requestObj.payload.closingStartDateRange
                        }
                        if (!requestObj.payload.eventCreationEndDateRange && requestObj.payload.eventCreationStartDateRange) {
                            requestObj.payload.eventCreationEndDateRange = requestObj.payload.eventCreationStartDateRange
                        }
                        if (!requestObj.payload.eventDateEndRange && requestObj.payload.eventDateStartRange) {
                            requestObj.payload.eventDateEndRange = requestObj.payload.eventDateStartRange
                        }
                        if (requestObj.payload.eventDate) {
                            requestObj.payload.eventDateStartRange = requestObj.payload.eventDate;
                            requestObj.payload.eventDateEndRange = requestObj.payload.eventDate;
                        }
                        // delete requestObj.query
                        requestObj.method = 'post';
                        return requestObj;
                    },        
                });
                if(res.header)
                    {
                        return reply.response(res.data).header('gr-hostname', res.header)
                         
                    }
                    else 
                    {
                        return reply.response(res.data)
                    }
            },
            options: {
                tags: ['api']                 
            }
        }
    ]
}
// server.route.get('/api/getEventsBySearchablePropertiesPerStore', {
//     tags: ['api']
// }, (request, reply) => {
//     serverUtils.triggerServerRequest({
//         request,
//         reply,
//         transformRequest: requestObj => {
//             requestObj.payload = requestObj.query
//             if (!requestObj.payload.closingEndDateRange && requestObj.payload.closingStartDateRange) {
//                 requestObj.payload.closingEndDateRange = requestObj.payload.closingStartDateRange
//             }
//             if (!requestObj.payload.eventCreationEndDateRange && requestObj.payload.eventCreationStartDateRange) {
//                 requestObj.payload.eventCreationEndDateRange = requestObj.payload.eventCreationStartDateRange
//             }
//             if (!requestObj.payload.eventDateEndRange && requestObj.payload.eventDateStartRange) {
//                 requestObj.payload.eventDateEndRange = requestObj.payload.eventDateStartRange
//             }
//             if (requestObj.payload.eventDate) {
//                 requestObj.payload.eventDateStartRange = requestObj.payload.eventDate;
//                 requestObj.payload.eventDateEndRange = requestObj.payload.eventDate;
//             }
//             // delete requestObj.query
//             requestObj.method = 'post';
//             return requestObj;
//         },
//     });

// });