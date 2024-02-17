// Dependencies
const { create, read, update, deleteFile } = require("../../lib/data");
const {
  hash,
  verifyPass,
  parseJson,
  createRandomString,
} = require("../../helpers/utilities");
const { parse } = require("path");

const handler = {};

handler.tokenHandler = (reqData, callBak) => {
  const aceptedMethods = ["get", "post", "put", "delete"];
  if (aceptedMethods.indexOf(reqData.method) > -1) {
    handler._token[reqData.method](reqData, callBak);
  } else {
    callBak(403, { eror: "Method not supported" });
  }
};

handler._token = {};

//get request
handler._token.get = (reqData, callBack) => {
  const { query } = reqData;
  const fileName =
    typeof query["id"] === "string" && query["id"].length === 20
      ? query["id"]
      : null;

  if (fileName) {
    read(`tokens/${fileName}`, (err, data) => {
      if (!err) {
        const modData = parseJson(data);
        callBack(200, modData);
      } else {
        callBack(500, { error: "Token does not exist" });
      }
    });
  } else {
    callBack(405, { error: "No  token id given" });
  }
};

//post request
handler._token.post = (reqData, callBack) => {
  const name =
    typeof reqData.body.name === "string" && reqData.body.name.trim().length > 0
      ? reqData.body.name
      : null;

  const pass =
    typeof reqData.body.pass === "string" && reqData.body.pass.trim().length > 0
      ? reqData.body.pass
      : null;

  if (name && pass) {
    read(`users/${name}`, (err, userData) => {
      if (!err) {
        const parsedData = parseJson(userData);
        const { body } = reqData;
        const verification = verifyPass(body.pass, parsedData.pass);
        if (verification) {
          const id = createRandomString(20);
          const userName = parsedData.name;
          const expires = Date.now() + 60 * 60 * 1000;
          const tokenObj = {
            id,
            userName,
            expires,
          };

          create(`tokens/${id}`, tokenObj, (err) => {
            if (!err) {
              callBack(200, { token: tokenObj });
            } else {
              callBack(500, { error: "Error creating the token" });
            }
          });
        } else {
          callBack(403, { error: "Authentication error" });
        }
      } else {
        callBack(403, { error: "Authentication error" });
      }
    });
  } else {
    callBack(404, { error: "Incorrect username or pasword" });
  }
};

// put request
handler._token.put = (reqData, callBack) => {
  const id =
    typeof reqData.body.id === "string" && reqData.body.id.trim().length === 20
      ? reqData.body.id
      : null;

  const updateToken =
    typeof reqData.body.update === "boolean" && reqData.body.update === true
      ? reqData.body.update
      : null;

  if (id && updateToken) {
    read(`tokens/${id}`, (err, data) => {
      if (!err) {
        const modData = parseJson(data);
        const oldExpires = modData.expires;
        if (oldExpires > Date.now()) {
          modData.expires = Date.now() + 60 * 60 * 1000;
          update(`tokens/${id}`, modData, (err) => {
            if (!err) {
              callBack(200, { message: "Successfully updated the token" });
            } else {
              callBack(500, {
                error: "There was a server site error.Please try again",
              });
            }
          });
        } else {
          callBack(404, {
            error: "Token already expired.Please create a new token",
          });
        }
      } else {
        callBack(500, { error: "Error happend openning token file" });
      }
    });
  } else {
    callBack(400, { error: "There is an error in your request" });
  }
};

// delete request
handler._token.delete = (reqData, callBack) => {
  const { query } = reqData;
  const fileName = typeof query["id"] === "string" ? query["id"] : null;
  if (fileName) {
    deleteFile(`tokens/${fileName}`, (err) => {
      if (!err) {
        callBack(200, { message: "Successfully deleted the token" });
      } else {
        callBack(500, { error: "Error happend deleting the token" });
      }
    });
  }
};

handler.tokenVerifier = (id, name, callBack) => {
  read(`tokens/${id}`, (err, tokenData) => {
    if (!err && tokenData) {
      const modData = parseJson(tokenData);
      if (modData.userName === name && modData.expires > Date.now()) {
        callBack(true);
      } else {
        callBack(false);
      }
    } else {
      callBack(false);
    }
  });
};
module.exports = handler;
