import Joi from "joi";
import axios from "axios";
import fs from "fs";
import path from "path";
import { server } from "hails";
import serverEndpoints from "../../../server/serverEndpoints";
import serverUtils from "../../utils/serverUtils";
import commonUtil from "../../../utils/commonUtil";
import settingsFile from "../../../../settings";
import log from "../../utils/logUtils";
import appconfig from "../../../config/appconfig";
import base64 from "base-64";
const http = require("https");

function otpAuthorizationOptions(url) {
  const protocol = url.split("://")[0];
  const preurl = url.split("://")[1];
  const options = {
    hostname: preurl.split("/")[0],
    path: url.split(protocol + "://" + preurl.split("/")[0])[1],
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return options;
}

function otpCreateUserOptions(url, token) {
  const protocol = url.split("://")[0];
  const preurl = url.split("://")[1];
  const options = {
    hostname: preurl.split("/")[0],
    path: url.split(protocol + "://" + preurl.split("/")[0])[1],
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  return options;
}
function reaAutenticationOptions(url, email, password) {
  const protocol = url.split("://")[0];
  const preurl = url.split("://")[1];
  const userpass = base64.encode(email + ":" + password);
  const options = {
    hostname: preurl.split("/")[0],
    path: url.split(protocol + "://" + preurl.split("/")[0])[1],
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + userpass,
    },
  };
  return options;
}
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
  return true;
}

server.route.post(
  "/api/accountStatementDetails",
  {
    tags: ["api"],
    validate: {
      payload: {
        eventId: Joi.string().required(),
        channel: Joi.string().required(),
        brand: Joi.string().required(),
      },
    },
  },
  (request, reply) => {
    // log.debug('api/accountStatementDetails:request-------', request);
    serverUtils.triggerServerRequest({
      request,
      reply,
      transformResponse: (response) => {
        if (response) {
          const start =
            response.eventAccountStatementInfo &&
            response.eventAccountStatementInfo.transferenceAllowedStartTime;
          const end =
            response.eventAccountStatementInfo &&
            response.eventAccountStatementInfo.transferenceAllowedEndTime;
          const current = Date.now();
          response.currTime = current;
          response.accountSystemAvailable = commonUtil.isAccountSystemAvailable(
            start,
            end,
            current
          );
          return response;
        }
      },
    });
  }
);

server.route.post(
  "/api/purchasedItemSummaryInfo",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().required(),
        brand: Joi.string().required(),
        eventId: Joi.string().required(),
        type: Joi.string().required(),
      },
    },
  },
  (request, reply) => {
    serverUtils.triggerServerRequest({
      request,
      reply,
    });
  }
);

server.route.post(
  "/api/purchasedItemsDetails",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().required(),
        brand: Joi.string().required(),
        eventId: Joi.string().required(),
        type: Joi.string().required(),
        filteringParameters: Joi.array()
          .items({ type: Joi.string(), value: Joi.string() })
          .required(),
        sortingParameters: Joi.array()
          .items({ type: Joi.string(), value: Joi.string() })
          .required(),
        currentPage: Joi.number().min(1).required(),
        isShowAll: Joi.boolean().required(),
      },
    },
  },
  (request, reply) => {
    serverUtils.triggerServerRequest({
      request,
      reply,
    });
  }
);

// bonusDetails
server.route.post(
  "/api/bonusDetails",
  {
    tags: ["api"],
    validate: {
      payload: {
        eventId: Joi.string().required(),
        channel: Joi.string().required(),
        brand: Joi.string().required(),
      },
    },
  },
  (request, reply) => {
    serverUtils.triggerServerRequest({
      request,
      reply,
    });
  }
);

// inTransit
server.route.post(
  "/api/inTransit",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().required(),
        brand: Joi.string().required(),
        eventId: Joi.string().required(),
      },
    },
  },
  (request, reply) => {
    serverUtils.triggerServerRequest({
      request,
      reply,
    });
  }
);

server.route.post(
  "/api/accountPartialTransferDetails",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().required(),
        brand: Joi.string().required(),
        eventId: Joi.string().required(),
      },
    },
  },
  (request, reply) => {
    serverUtils.triggerServerRequest({
      request,
      reply,
    });
  }
);

server.route.post(
  "/api/getEventSummaryInfo",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().required(),
        brand: Joi.string().required(),
        eventId: Joi.string().required(),
        profileId: Joi.string().required(),
        emailId: Joi.string().required(),
      },
    },
  },
  (request, reply) => {
    serverUtils.triggerServerRequest({
      request,
      reply,
    });
  }
);

// submit Transference

server.route.post(
  "/api/submitTransference",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().min(1).required(),
        brand: Joi.string().min(1).required(),
        eventId: Joi.string().min(1).required(),
        eventOwnerId: Joi.string().min(1).required(),
        type: Joi.string().min(1).required(),
        walletOrEmployeeIdentifierId: Joi.string().optional().allow(""),
        walletOrEmployeeCardAmount: Joi.number().optional().allow(""),
        cardOrBankIdentifierId: Joi.string().optional().allow(""),
        paymentType: Joi.string().optional().allow(""),
        walletHolderName: Joi.string().optional().allow(""),
        accountName: Joi.string().optional().allow(""),
        walletType: Joi.string().optional().allow(""),
        cardOrBankAmount: Joi.string().optional().allow(""),
        bonusAmount: Joi.string().optional().allow(""),
        commissionAmount: Joi.number().optional().allow(""),
        walletCommissionAmount: Joi.string().optional().allow(""),
        walletNumber: Joi.string().optional().allow(""),
        number: Joi.string().optional().allow(""),
        skus: Joi.array().items(Joi.string()).allow(""),
        selectedStoreOption: Joi.string().optional().allow(""),
        selectedAddressId: Joi.string().optional().allow(""),
        totalAmount: Joi.string().optional().allow(""),
        approverId: Joi.string().optional().allow(""),
      },
    },
  },
  (request, reply) => {
    serverUtils.triggerServerRequest({
      request,
      reply,
      transformResponse: (response) => {
        if (response && response.transactionStatusObject) {
          response.transactionStatusObject.currTime = Date.now();
          return response;
        }
      },
    });
  }
);
// verifyStoreAssociate
server.route.post(
  "/api/verifyStoreAssociate",
  {
    tags: ["api"],
    validate: {
      payload: {
        emailId: Joi.string().required(),
        password: Joi.string().required(),
        channel: Joi.string().required(),
        brand: Joi.string().required(),
      },
    },
  },
  (request, reply) => {
    serverUtils.triggerServerRequest({
      request,
      reply,
    });
  }
);

// transferenceoptions
server.route.post(
  "/api/transferenceOptions",
  {
    tags: ["api"],
    validate: {
      payload: {
        eventId: Joi.string().required(),
        eventOwnerId: Joi.string().optional().allow(""),
        type: Joi.string().required(),
        channel: Joi.string().required(),
        brand: Joi.string().required(),
        activatePhysicalWallet: Joi.string().optional().allow(),
      },
    },
  },
  (request, reply) => {
    serverUtils.triggerServerRequest({
      request,
      reply,
      transformResponse: (response) => {
        if (response) {
          response.currTime = Date.now();
          return response;
        }
      },
    });
  }
);

// calculateCommision
server.route.post(
  "/api/calculateCommision",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().min(1).required(),
        brand: Joi.string().min(1).required(),
        eventId: Joi.string().min(1).required(),
        accountType: Joi.string().optional().allow(""),
        walletType: Joi.string().optional().allow(""),
        amount: Joi.string().min(1).required(),
        accountId: Joi.string().optional().allow(""),
      },
    },
  },
  (request, reply) => {
    serverUtils.triggerServerRequest({
      request,
      reply,
    });
  }
);

server.route.post(
  "/api/deleteBankOrCardDetails",
  {
    tags: ["api"],
    validate: {
      payload: {
        accountId: Joi.string().required(),
        channel: Joi.string().required(),
        brand: Joi.string().required(),
      },
    },
  },
  (request, reply) => {
    serverUtils.triggerServerRequest({
      request,
      reply,
    });
  }
);

// getEwalletInfo
server.route.post(
  "/api/getEwalletInfo",
  {
    tags: ["api"],
    validate: {
      payload: {
        profileId: Joi.string().required(),
        channel: Joi.string().required(),
        brand: Joi.string().required(),
      },
    },
  },
  (request, reply) => {
    serverUtils.triggerServerRequest({
      request,
      reply,
    });
  }
);

server.route.post(
  "/api/reAuthenticateUser",
  {
    tags: ["api"],
    validate: {
      payload: {
        email: Joi.string().required(),
        password: Joi.string().required(),
        channel: Joi.string().required(),
        brand: Joi.string().required(),
      },
    },
  },
  async (request, reply) => {
    log.debug("request.payload reaAuth", request.payload);
    log.debug(serverEndpoints["/api/reAuthenticateUser"]);
    const success = { _links: {}, status: { status: "success" } };
    const fail = {
      _links: {},
      status: {
        errorMessage:
          "Tu contrase?a es incorrecta. Por favor intenta nuevamente.",
        errorCode: "002",
        status: "failure",
      },
    };
    let data = "";
    try {
      console.log(
        reaAutenticationOptions(
          serverEndpoints["/api/reAuthenticateUser"],
          request.payload.email,
          request.payload.password
        )
      );
      var req = await http.request(
        reaAutenticationOptions(
          serverEndpoints["/api/reAuthenticateUser"],
          request.payload.email,
          request.payload.password
        ),
        function (response) {
          var chunks = [];
          response.on("data", function (chunk) {
            chunks.push(chunk);
          });
          response.on("end", function () {
            var text = Buffer.concat(chunks);
            var body = JSON.parse(text.toString());
            if (body.status && body.status.status) {
              if (body.status.status == "OK") {
                data = success;
              } else {
                data = fail;
              }
            } else {
              data = fail;
            }
            reply(data);
          });
        }
      );

      req.end();
    } catch (error) {
      log.debug(error);
      reply(error);
    }
  }
);

server.route.post(
  "/api/saveBankOrCardDetails",
  {
    tags: ["api"],
    validate: {
      payload: {
        accountId: Joi.string().required(),
        channel: Joi.string().required(),
        brand: Joi.string().required(),
      },
    },
  },
  (request, reply) => {
    serverUtils.triggerServerRequest({
      request,
      reply,
    });
  }
);

server.route.post(
  "/api/submitRefundTransaction",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().required(),
        brand: Joi.string().required(),
        eventId: Joi.string().required(),
        eventOwnerId: Joi.string().required(),
        type: Joi.string().required(),
        walletOrEmployeeIdentifierId: Joi.string().optional().allow(""),
        walletOrEmployeeCardAmount: Joi.string().optional().allow(),
        cardOrBankIdentifierId: Joi.string().optional().allow(""),
        paymentType: Joi.string().optional().allow(),
        walletHolderName: Joi.string().optional().allow(""),
        accountName: Joi.string().optional().allow(),
        walletType: Joi.string().optional().allow(),
        cardOrBankAmount: Joi.string().optional().allow(),
        commissionAmount: Joi.string().optional().allow(),
        walletCommissionAmount: Joi.string().optional().allow(),
        walletNumber: Joi.string().optional().allow(),
        number: Joi.string().optional().allow(),
        totalAmount: Joi.string().optional().allow(),
        approverId: Joi.string().optional().allow(""),
        reasonForCancelOrReturn: Joi.string().optional().allow(),
        refundList: Joi.object().optional().allow(),
      },
    },
  },
  async (request, reply) => {
    serverUtils.triggerServerRequest(
      // [
      // {
      //   request,
      //   reply,
      //   transformRequest: (requestObj) => {
      //     requestObj.path = '/api/getInitiateReturnList'
      //     requestObj.payload.refundList.brand = requestObj.payload.brand;
      //     requestObj.payload.refundList.channel = requestObj.payload.channel;
      //     requestObj.originalpayload = requestObj.payload;
      //     requestObj.payload = requestObj.payload.refundList;
      //     return requestObj;
      //   }
      // },
      {
        request,
        reply,
        // transformRequest: (requestObj) => {
        //   requestObj.payload = requestObj.originalpayload;
        //   delete requestObj.payload.refundList;
        //   delete requestObj.path
        //   requestObj.path = '/api/submitRefundTransaction'
        //   return requestObj;
        // },
        transformResponse: (responseObj, requestObj) => {
          if (responseObj && responseObj.transactionStatusObject) {
            responseObj.transactionStatusObject.currTime = Date.now();
          }
          return responseObj;
        },
      }
      // ]
    );
  }
);

server.route.post(
  "/api/StatementDetailsForPrintAndDownload",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().required(),
        brand: Joi.string().required(),
        eventId: Joi.string().optional().allow(""),
        plasticCardNumber: Joi.string().optional().allow(""),
      },
    },
  },
  async (request, reply) => {
    log.debug("request.payload", request.payload);
    log.debug(serverEndpoints["/api/StatementDetailsForPrintAndDownload"]);
    try {
      const response = await axios.post(
        serverEndpoints["/api/StatementDetailsForPrintAndDownload"],
        {
          channel: request.payload.channel,
          brand: request.payload.brand,
          eventId: request.payload.eventId,
        },
        {
          headers: request.headers,
        }
      );
      log.debug(response.data);
      reply(response.data);
    } catch (error) {
      reply(error);
    }
  }
);

// initiateEventCloseProcess
server.route.post(
  "/api/initiateEventCloseProcess",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().min(1).required(),
        brand: Joi.string().min(1).required(),
        eventId: Joi.number().min(1).required(),
      },
    },
  },
  (request, reply) => {
    serverUtils.triggerServerRequest({
      request,
      reply,
    });
  }
);

server.route.post(
  "/api/sendMail",
  {
    tags: ["api"],
    payload: {
      maxBytes: 10485760,
    },
  },
  (request, reply) => {
    log.debug("/api/sendMail for event :: ", request.payload.eventId);
    const settings = settingsFile[process.env.NODE_ENV];
    const buffer = request.payload.file;
    if (buffer) {
      const filePath = `${settings.mount}${settings.notificationsDir}${request.payload.eventId}`;
      const promise = function (bufferRequest) {
        const payload = bufferRequest.payload;
        return new Promise((resolve) => {
          const locationPath = filePath + "/" + payload.documentName;
          serverUtils.ensureDirectoryExistence(locationPath);
          fs.writeFile(locationPath, buffer, "base64", (error) => {
            if (error) reject(error);
            log.debug("saved xx-file to :: " + locationPath);
            fs.chmodSync(locationPath, settings.filePermissions);
            log.debug("permissions given to xx-file :: " + locationPath);
            delete payload.documentName;
            delete payload.file;
            resolve(bufferRequest);
          });
        });
      };
      promise(request)
        .then(
          (resolved) => {
            serverUtils.triggerServerRequest({
              request: resolved,
              reply,
            });
          },
          (reject) => {
            log.error("received xx-error /api/sendmail :: ", reject);
            reply(appconfig.defaultError);
          }
        )
        .catch((error) => {
          log.error("received xx-error /api/sendmail :: ", error);
          reply(appconfig.defaultError);
        });
    } else {
      log.error("received xx-error /api/sendmail :: no buffer");
      reply(appconfig.defaultError);
    }
  }
);

// OTP Code Services
// Create OTP Authentication
server.route.post(
  "/api/otpAuthenticate",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().required(),
        brand: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required()
      },
    },
  },
  async (request, reply) => {
    log.debug("request.payload otpAuthenticate", request.payload);
    log.debug(serverEndpoints["/api/otpAuthenticate"]);
    try {
      var req = await http.request(
        otpAuthorizationOptions(
          serverEndpoints["/api/otpAuthenticate"]
        ),
        function (response) {
          var chunks = [];
          response.on("data", function (chunk) {
            chunks.push(chunk);
          });
          response.on("end", function () {
            var text = Buffer.concat(chunks);
            var body = JSON.parse(text.toString());
            if(body.token) {
              reply({ token: body.token });
            } else {
              reply("Error")
            }
          });
        }
      );
      var postData = JSON.stringify({
        "username": request.payload.username,
        "password": request.payload.password,
      });
      req.write(postData)    
      req.end();
    } catch (error) {
      log.debug(error);
      reply(error);
    }
  }
);


// OTP Create User
server.route.post(
  "/api/otpCreateUser",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().required(),
        brand: Joi.string().required(),
        profileId: Joi.string().required(),
        token: Joi.string().required()
      },
    },
  },
  async (request, reply) => {
    log.debug("request.payload otpCreateUser", request.payload);
    log.debug(serverEndpoints["/api/otpCreateUser"]);
    try {
      var req = await http.request(
        otpCreateUserOptions(
          serverEndpoints["/api/otpCreateUser"],
          request.payload.token 
        ),
        function (response) {
          var chunks = [];
          response.on("data", function (chunk) {
            chunks.push(chunk);
          });
          response.on("end", function () {
            var text = Buffer.concat(chunks);
            var body = JSON.parse(text.toString());
            log.debug("OTP User Creation", body);
            if(body.status == 201 || body.status == 409){
              reply("userCreated");
            } else {
              reply("Error")
            }
          });
        }
      );
      var postData = JSON.stringify({
        "profileId": request.payload.profileId
      });
      req.write(postData)    
      req.end();
    } catch (error) {
      log.debug(error);
      reply(error);
    }
  }
);

// OTP Create Device
server.route.post(
  "/api/createDevice",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().required(),
        brand: Joi.string().required(),
        profileId: Joi.string().required(),
        token: Joi.string().required()
      },
    },
  },
  async (request, reply) => {
    log.debug("request.payload createDevice", request.payload);
    log.debug(serverEndpoints["/api/createDevice"]);
    try {
      var req = await http.request(
        otpCreateUserOptions(
          serverEndpoints["/api/createDevice"],
          request.payload.token
        ),
        function (response) {
          var chunks = [];
          response.on("data", function (chunk) {
            chunks.push(chunk);
          });
          response.on("end", function () {
            var text = Buffer.concat(chunks);
            var body = JSON.parse(text.toString());
            log.debug("OTP Device Creation", body);
            if(body.status == 201 || body.status == 409){
              reply("deviceCreated");
            } else {
              reply("Error")
            }
          });
        }
      );
      var postData = JSON.stringify({
        "profileId": request.payload.profileId
      });
      req.write(postData)    
      req.end();
    } catch (error) {
      log.debug(error);
      reply(error);
    }
  }
);


// OTP Create OTP
server.route.post(
  "/api/createOtp",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().required(),
        brand: Joi.string().required(),
        profileId: Joi.string().required(),
        eventNumber: Joi.string().required(),
        token: Joi.string().required()
      },
    },
  },
  async (request, reply) => {
    log.debug("request.payload createOtp", request.payload);
    log.debug(serverEndpoints["/api/createOtp"]);
    try {
      var req = await http.request(
        otpCreateUserOptions(
          serverEndpoints["/api/createOtp"],
          request.payload.token
        ),
        function (response) {
          var chunks = [];
          response.on("data", function (chunk) {
            chunks.push(chunk);
          });
          response.on("end", function () {
            var text = Buffer.concat(chunks);
            var body = JSON.parse(text.toString());
            log.debug("OTP Creation", body);
            if(body.status == '200'){
              reply({ phoneNumber: body.phoneNumber, email: body.email, status: body.status });
            } else {
              reply("Error")
            }
          });
        }
      );
      var postData = JSON.stringify({
        "profileId": request.payload.profileId,
        "eventNumber": request.payload.eventNumber,
        "channel": request.payload.channel,
        "brand": request.payload.brand
      });
      req.write(postData)    
      req.end();
    } catch (error) {
      log.debug(error);
      reply(error);
    }
  }
);


// OTP Validate OTP
server.route.post(
  "/api/validateOtp",
  {
    tags: ["api"],
    validate: {
      payload: {
        channel: Joi.string().required(),
        brand: Joi.string().required(),
        profileId: Joi.string().required(),
        otp: Joi.string().required(),
        token: Joi.string().required()
      },
    },
  },
  async (request, reply) => {
    log.debug("request.payload validateOtp", request.payload);
    log.debug(serverEndpoints["/api/validateOtp"]);
    try {
      var req = await http.request(
        otpCreateUserOptions(
          serverEndpoints["/api/validateOtp"],
          request.payload.token
        ),
        function (response) {
          var chunks = [];
          response.on("data", function (chunk) {
            chunks.push(chunk);
          });
          response.on("end", function () {
            var text = Buffer.concat(chunks);
            var body = JSON.parse(text.toString());
            log.debug("OTP Validation", body);
            if (body.status == 200) reply("otpValidated");
              else reply("otpUnauthorized");
          });
        }
      );
      var postData = JSON.stringify({
        "profileId": request.payload.profileId,
        "otp": request.payload.otp,
        "channel": request.payload.channel
      });
      req.write(postData)    
      req.end();
    } catch (error) {
      log.debug(error);
      reply(error);
    }
  }
);