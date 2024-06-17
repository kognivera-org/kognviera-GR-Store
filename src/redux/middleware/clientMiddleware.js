import errorHandler from 'pages/global/errorHandler'
// import { debug } from 'util';
import routeconfig from 'config/routeconfig';
import _ from 'lodash';

export default function clientMiddleware(client) {
  return ({ dispatch, getState }) => {
    return next => async action => {
      if (typeof action === 'function') {
        return action(dispatch, getState)
      }

      const operations = _.isArray(action) ? action : [action];

      if (operations) {
        let failedstatus = false;

        for (var i = 0; i < operations.length; i++) {
          const actionNow = operations[i];

          const { ping, types, ...rest } = actionNow;

          if (!ping) {
            return next(actionNow)
          }
          let response
          if (!failedstatus) {

            const [REQUEST, SUCCESS, FAILURE] = types

            try {
              // dispatch pending
              next({ ...rest, type: REQUEST })
              // calling api
              response = await ping(client)


              if (response) {

                // analyze response
                const data = response.data;

                if (data.status === 'failure' ||
                  (data.status && data.status.status && data.status.status.toLowerCase() === 'failure')) {
                  // validation error
                  if ((data && data.errorCode === '1002') ||
                    (data.status && data.status.errorCode === '1002')) {
                    // session expired
                    if (typeof window != 'undefined') {
                      window.localStorage.removeItem("user");
                      window.localStorage.removeItem("storeId");
                      window.location.href = routeconfig.root;
                    }
                  }
                  next({ type: FAILURE, payload: response.data.status })
                  failedstatus = true;

                } else {
                  next({ type: SUCCESS, payload: response.data })
                }
              }
            } catch (error) {
              errorHandler(next, error, FAILURE)
              failedstatus = true;
            }

            if (i == operations.length - 1) {
              return response
            }

          } else {
            // earlier action failed
            return response
          }
        }
      }
    }
  }
}