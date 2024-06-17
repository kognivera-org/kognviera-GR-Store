const _ = require('lodash'),
    accountSummary = require("./modules/accountSummary/api")(),
    activityLogs = require("./modules/activityLogs/api")(),
    cachecontrols = require("./modules/cachecontrols/api")(),
    changeOfEvent = require("./modules/changeOfEvent/api")(),
    contract = require("./modules/contract/api")(),
    getState = require("./modules/dashboard/api")(),
    labels = require("./modules/labels/api")(),
    user = require("./modules/user/api")(),

    Routes = _.unionBy(accountSummary,activityLogs,cachecontrols,changeOfEvent,contract,getState,labels,user);

 export const ApiRoutes = Routes;