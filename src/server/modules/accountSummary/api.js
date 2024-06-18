import Joi from "joi";
import axios from "axios";
import fs from "fs";
import path from "path";
// import { server } from "hails";
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

module.exports = function () {
  return [
    {
      method: 'POST',
      path: '/api/accountStatementDetails',
      handler: async (request, reply) => {
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
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            eventId: Joi.string().required(),
            channel: Joi.string().required(),
            brand: Joi.string().required(),
          }),
        }
      }
    },
    {
      method: 'POST',
      path: '/api/purchasedItemSummaryInfo',
      handler: async (request, reply) => {
        serverUtils.triggerServerRequest({
          request,
          reply,
        });
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            type: Joi.string().required(),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/purchasedItemsDetails',
      handler: async (request, reply) => {
        serverUtils.triggerServerRequest({
          request,
          reply,
        });
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
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
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/bonusDetails',
      handler: async (request, reply) => {
        serverUtils.triggerServerRequest({
          request,
          reply,
        });
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            eventId: Joi.string().required(),
            channel: Joi.string().required(),
            brand: Joi.string().required(),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/inTransit',
      handler: async (request, reply) => {
        serverUtils.triggerServerRequest({
          request,
          reply,
        });
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/accountPartialTransferDetails',
      handler: async (request, reply) => {
        serverUtils.triggerServerRequest({
          request,
          reply,
        });
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/getEventSummaryInfo',
      handler: async (request, reply) => {
        serverUtils.triggerServerRequest({
          request,
          reply,
        });
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().required(),
            profileId: Joi.string().required(),
            emailId: Joi.string().required(),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/submitTransference',
      handler: async (request, reply) => {
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
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
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
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/verifyStoreAssociate',
      handler: async (request, reply) => {
        serverUtils.triggerServerRequest({
          request,
          reply,
        });
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            emailId: Joi.string().required(),
            password: Joi.string().required(),
            channel: Joi.string().required(),
            brand: Joi.string().required(),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/transferenceOptions',
      handler: async (request, reply) => {
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
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            eventId: Joi.string().required(),
            eventOwnerId: Joi.string().optional().allow(""),
            type: Joi.string().required(),
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            activatePhysicalWallet: Joi.string().optional().allow(),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/calculateCommision',
      handler: async (request, reply) => {
        serverUtils.triggerServerRequest({
          request,
          reply,
        });
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            channel: Joi.string().min(1).required(),
            brand: Joi.string().min(1).required(),
            eventId: Joi.string().min(1).required(),
            accountType: Joi.string().optional().allow(""),
            walletType: Joi.string().optional().allow(""),
            amount: Joi.string().min(1).required(),
            accountId: Joi.string().optional().allow(""),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/deleteBankOrCardDetails',
      handler: async (request, reply) => {
        serverUtils.triggerServerRequest({
          request,
          reply,
        });
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            eventId: Joi.string().required(),
            channel: Joi.string().required(),
            brand: Joi.string().required(),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/getEwalletInfo',
      handler: async (request, reply) => {
        serverUtils.triggerServerRequest({
          request,
          reply,
        });
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            profileId: Joi.string().required(),
            channel: Joi.string().required(),
            brand: Joi.string().required(),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/reAuthenticateUser',
      handler: async (request, reply) => {
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
                return reply.response(data);
              });
            }
          );
    
          req.end();
        } catch (error) {
          log.debug(error);
          return reply.response(error);
        }
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            eventId: Joi.string().required(),
            channel: Joi.string().required(),
            brand: Joi.string().required(),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/saveBankOrCardDetails',
      handler: async (request, reply) => {
        serverUtils.triggerServerRequest({
          request,
          reply,
        });
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            accountId: Joi.string().required(),
            channel: Joi.string().required(),
            brand: Joi.string().required(),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/submitRefundTransaction',
      handler: async (request, reply) => {
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
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
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
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/StatementDetailsForPrintAndDownload',
      handler: async (request, reply) => {
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
          return reply.response(response.data);
        } catch (error) {
          return reply.response(error);
        }
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            eventId: Joi.string().optional().allow(""),
            plasticCardNumber: Joi.string().optional().allow(""),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/initiateEventCloseProcess',
      handler: async (request, reply) => {
        serverUtils.triggerServerRequest({
          request,
          reply,
        });
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            channel: Joi.string().min(1).required(),
            brand: Joi.string().min(1).required(),
            eventId: Joi.number().min(1).required(),
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/sendMail',
      handler: async (request, reply) => {
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
                return reply.response(appconfig.defaultError);
              }
            )
            .catch((error) => {
              log.error("received xx-error /api/sendmail :: ", error);
              return reply.response(appconfig.defaultError);
            });
        } else {
          log.error("received xx-error /api/sendmail :: no buffer");
          return reply.response(appconfig.defaultError);
        }
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            maxBytes: 10485760,
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/otpAuthenticate',
      handler: async (request, reply) => {
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
                  return reply.response({ token: body.token });
                } else {
                  return reply.response("Error")
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
          return reply.response(error);
        }
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            username: Joi.string().required(),
            password: Joi.string().required()
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/otpCreateUser',
      handler: async (request, reply) => {
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
                  return reply.response("userCreated");
                } else {
                  return reply.response("Error")
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
          return reply.response(error);
        }
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            profileId: Joi.string().required(),
            token: Joi.string().required()
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/createDevice',
      handler: async (request, reply) => {
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
                  return reply.response("deviceCreated");
                } else {
                  return reply.response("Error")
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
          return reply.response(error);
        }
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            profileId: Joi.string().required(),
            token: Joi.string().required()
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/createOtp',
      handler: async (request, reply) => {
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
                  return reply.response({ phoneNumber: body.phoneNumber, email: body.email, status: body.status });
                } else {
                  return reply.response("Error")
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
          return reply.response(error);
        }
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            profileId: Joi.string().required(),
            eventNumber: Joi.string().required(),
            token: Joi.string().required()
          }),
        }
      }
    },{
      method: 'POST',
      path: '/api/validateOtp',
      handler: async (request, reply) => {
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
                if (body.status == 200) reply.response("otpValidated");
                  else reply.response("otpUnauthorized");
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
          return reply.response(error);
        }
      },
      options: {
        tags: ['api'],
        validate: {
          payload: Joi.object({
            channel: Joi.string().required(),
            brand: Joi.string().required(),
            profileId: Joi.string().required(),
            otp: Joi.string().required(),
            token: Joi.string().required()
          }),
        }
      }
    },
  ]
}