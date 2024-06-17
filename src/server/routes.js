const _ = require('lodash'),
    accountSummary = require("./modules/accountSummary/api")(),
    getState = require("./modules/dashboard/api")(),
    labels = require("./modules/labels/api")(),
    user = require("./modules/user/api")(),

    Routes = _.unionBy(accountSummary,getState,labels,user);

 export const ApiRoutes = Routes;