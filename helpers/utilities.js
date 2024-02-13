// dependencies
const crypto = require("crypto");
const env = require("./env");
const utilities = {};

utilities.parseJson = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};

utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    console.log(env.key);
    const hmac = crypto.createHmac("sha256", env.key);
    hmac.update(str);
    return hmac.digest("hex");
  } else {
    return false;
  }
};

utilities.verifyPass = (inpPass, savePass) => {
  const hashPass = utilities.hash(inpPass);
  return hashPass === savePass;
};

utilities.createRandomString = (strLength) => {
  const strLen =
    typeof strLength === "number" && strLength > 0 ? strLength : false;

  if (strLen) {
    const possVal = "abcdefghijklmnopqrstuvwxyz1234567890@#$";

    let output = "";

    for (let i = 0; i < strLen; i++) {
      const randChar = possVal.charAt(
        Math.floor(Math.random() * possVal.length)
      );
      output += randChar;
    }
    return output;
  }
  return false;
};

module.exports = utilities;
