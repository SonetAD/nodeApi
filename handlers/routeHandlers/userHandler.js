// Dependencies
const { create, read, update, deleteFile } = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { parseJson, verifyPass } = require("../../helpers/utilities");

const handler = {};
// user handler
handler.userHandler = (reqData, callBak) => {
  const aceptedMethods = ["get", "post", "put", "delete"];
  if (aceptedMethods.indexOf(reqData.method) > -1) {
    handler._user[reqData.method](reqData, callBak);
  } else {
    callBak(405);
  }
};

handler._user = {};

// get method
handler._user.get = (reqData, callBack) => {
  const { query } = reqData;
  const fileName = typeof query["name"] === "string" ? query["name"] : null;

  if (fileName) {
    read(`users/${fileName}`, (err, data) => {
      if (!err) {
        const modData = parseJson(data);
        delete modData.pass;
        callBack(200, modData);
      } else {
        callBack(500, { error: "User does not exist" });
      }
    });
  } else {
    callBack(405, { error: "No user name given" });
  }
};
// post method
handler._user.post = (reqData, callBack) => {
  const name =
    typeof reqData.body.name === "string" && reqData.body.name.trim().length > 0
      ? reqData.body.name
      : null;

  const pass =
    typeof reqData.body.pass === "string" && reqData.body.pass.trim().length > 0
      ? reqData.body.pass
      : null;

  const number =
    typeof reqData.body.number === "string" &&
    reqData.body.number.trim().length === 11
      ? reqData.body.name
      : null;

  const tos = typeof reqData.body.tos === "boolean" ? reqData.body.tos : null;

  if (name && number && tos && pass) {
    const userData = {
      name,
      number,
      tos,
      pass: hash(pass),
    };
    create(`users/${name}`, userData, (err) => {
      if (!err) {
        callBack(200, { message: "User successfully created" });
      } else {
        callBack(500, {
          error: "Error creating user.Please try again with right info",
        });
      }
    });
  }
};
// put method
handler._user.put = (reqData, callBack) => {
  const { query } = reqData;
  const fileName = typeof query["name"] === "string" ? query["name"] : null;
  const name =
    typeof reqData.body.name === "string" && reqData.body.name.trim().length > 0
      ? reqData.body.name
      : null;

  const pass =
    typeof reqData.body.pass === "string" && reqData.body.pass.trim().length > 0
      ? reqData.body.pass
      : null;

  const number =
    typeof reqData.body.number === "string" &&
    reqData.body.number.trim().length === 11
      ? reqData.body.name
      : null;

  const tos = typeof reqData.body.tos === "boolean" ? reqData.body.tos : null;

  read(`users/${fileName}`, (err, data) => {
    if (!err) {
      const jsonData = parseJson(data);
      const savedPass = jsonData.pass;

      const verification = verifyPass(pass, savedPass);
      if (verification) {
        if (name && number && tos && pass && fileName) {
          const userData = {
            name,
            number,
            tos,
            pass: hash(pass),
          };
          update(`users/${fileName}`, userData, (err) => {
            if (!err) {
              callBack(200, { message: "Successfully updated user info" });
            } else {
              callBack(500, { error: "Error updateing user info" });
            }
          });
        }
      } else {
        callBack(400, { error: "Wrong password" });
      }
    }
  });
};

// delete method
handler._user.delete = (reqData, callBack) => {
  const { query } = reqData;
  const fileName = typeof query["name"] === "string" ? query["name"] : null;
  if (fileName) {
    deleteFile(`users/${fileName}`, (err) => {
      if (!err) {
        callBack(200, { message: "Successfully deleted the user" });
      } else {
        callBack(500, { error: "Error happend deleting the user" });
      }
    });
  }
};

module.exports = handler;
