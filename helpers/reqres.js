// Dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const { parseJson } = require("./utilities");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");

const handler = {};

handler.handleReqRes = (req, res) => {
  const parssedUrl = url.parse(req.url, true);
  const pathName = parssedUrl.pathname;
  const trimmedPath = pathName.replace(/^\/|\/$/g, "");
  const method = req.method.toLowerCase();
  const query = parssedUrl.query;
  const headers = req.headers;
  const chosenRoute = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  const reqProperties = {
    parssedUrl,
    pathName,
    trimmedPath,
    method,
    query,
    headers,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    reqProperties.body = parseJson(realData);

    chosenRoute(reqProperties, (status, payload) => {
      const modStatus = typeof status === "number" ? status : 505;
      const modPayload = typeof payload === "object" ? payload : {};

      res.writeHead(modStatus, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(modPayload));
    });
  });
};

module.exports = handler;
