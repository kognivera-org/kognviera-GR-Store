const _ = require('lodash'),
    accountSummary = require("./modules/accountSummary/api")(),
    activityLogs = require("./modules/activityLogs/api")(),
    cachecontrols = require("./modules/cachecontrols/api")(),
    changeOfEvent = require("./modules/changeOfEvent/api")(),
    contract = require("./modules/contract/api")(),
    delivery = require("./modules/delivery/api")(),
    eventCreation = require("./modules/eventCreation/api")(),
    getState = require("./modules/dashboard/api")(),
    labels = require("./modules/labels/api")(),
    user = require("./modules/user/api")(),
    reports =require("./modules/reports/api"),
    returns = require("./modules/return/api"),
    verificationDoc = require("./modules/verificationDocuments/api"),

    Routes = _.unionBy(accountSummary,activityLogs,cachecontrols,changeOfEvent,contract,delivery,eventCreation,getState,labels,user,reports,returns,verificationDoc);

 export const ApiRoutes = Routes;