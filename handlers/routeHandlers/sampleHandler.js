const handler = {};

handler.sampleHandler = (reqProperties, callBack) => {
  console.log(reqProperties);
  callBack(200, { message: "This is a sample route" });
};
module.exports = handler;
