const _ = require('lodash'),
    accountSummary = require("./modules/accountSummary/api")(),
    getState = require("./modules/dashboard/api")(),
    labels = require("./modules/labels/api")(),
    
    Routes = _.unionBy(accountSummary,getState,labels);

 export const ApiRoutes = Routes;