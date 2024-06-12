const _ = require('lodash'),
    accountSummary = require("./modules/accountSummary/api")(),
    
    Routes = _.unionBy(accountSummary,);

 export const ApiRoutes = Routes;