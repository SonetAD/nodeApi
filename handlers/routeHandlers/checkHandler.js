// Dependencies
const { create, read, update, deleteFile } = require("../../lib/data");
const { hash, createRandomString } = require("../../helpers/utilities");
const { parseJson, verifyPass } = require("../../helpers/utilities");
const { tokenVerifier } = require("./tokenhandler");

const { maxChecks } = require("../../helpers/env");
const handler = {};
// user handler
handler.checkHandler = (reqData, callBak) => {
  const aceptedMethods = ["get", "post", "put", "delete"];
  if (aceptedMethods.indexOf(reqData.method) > -1) {
    handler._check[reqData.method](reqData, callBak);
  } else {
    callBak(403, { error: "Method not supported" });
  }
};

handler._check = {};

// get method
handler._check.get = (reqData, callBack) => {};
// post method
handler._check.post = (reqData, callBack) => {
  const protocol =
    typeof reqData.body.protocol === "string" &&
    ["http", "https"].indexOf(reqData.body.protocol) > -1
      ? reqData.body.protocol
      : null;

  const method =
    typeof reqData.body.protocol === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(reqData.body.method) > -1
      ? reqData.body.method
      : null;
  const url =
    typeof reqData.body.url === "string" && reqData.body.url.trim().length > 0
      ? reqData.body.url
      : null;

  const successCode =
    typeof reqData.body.successCode === "object" &&
    reqData.body.successCode instanceof Array
      ? reqData.body.successCode
      : null;

  const timeOutSec =
    typeof reqData.body.timeOutSec === "number" &&
    1 <= reqData.body.timeOutSec <= 5 &&
    reqData.body.timeOutSec % 1 === 0
      ? reqData.body.timeOutSec
      : null;

  if (protocol && url && method && timeOutSec && successCode) {
    const { headers } = reqData;
    const token = typeof headers.token === "string" ? headers.token : false;

    read(`tokens/${token}`, (err, tokenData) => {
      if (!err && tokenData) {
        const parsedData = parseJson(tokenData);
        const userName = parsedData.userName;
        read(`users/${userName}`, (err, userData) => {
          if (!err && userData) {
            tokenVerifier(token, userName, (tokenValidity) => {
              if (tokenValidity) {
                const parsedUserData = parseJson(userData);
                const userChecks =
                  typeof parsedUserData.checks === "object" &&
                  parsedUserData.checks instanceof Array
                    ? parsedUserData.checks
                    : [];

                if (userChecks.length <= maxChecks) {
                  const checkId = createRandomString(20);
                  const checkObj = {
                    id: checkId,
                    name: parsedUserData.name,
                    protocol,
                    url,
                    method,
                    successCode,
                    timeOutSec,
                  };

                  create(`checks/${checkId}`, checkObj, (err) => {
                    if (!err) {
                      parsedUserData.checks = userChecks;
                      parsedUserData.checks.push(checkId);
                      update(
                        `users/${parsedUserData.name}`,
                        parsedUserData,
                        (err) => {
                          if (!err) {
                            callBack(200, checkObj);
                          } else {
                            callBack(500, { error: "Server site error" });
                          }
                        }
                      );
                    } else {
                      callBack(500, { error: "Server site error" });
                    }
                  });
                } else {
                  callBack(401, { error: "You have cross your checks limits" });
                }
              } else {
                callBack(403, { error: "Token not valid" });
              }
            });
          } else {
            callBack(404, { error: "User not found" });
          }
        });
      } else {
        callBack(403, { error: "Authentication error" });
      }
    });
  } else {
    callBack(403, { error: "Error in your request" });
  }
};
// put method
handler._check.put = (reqData, callBack) => {};

// delete method
handler._check.delete = (reqData, callBack) => {};

module.exports = handler;
