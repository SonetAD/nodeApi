const handler = {};

handler.notFoundHandler = (reqProperties, callBack) => {
  console.log(reqProperties);
  callBack(404, { message: "Route not found" });
};
module.exports = handler;
