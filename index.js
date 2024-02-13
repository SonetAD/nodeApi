// Dependencies

const http = require("http");
const reqres = require("./helpers/reqres");
const env = require("./helpers/env");
const dataLib = require("./lib/data");

// app scafold

const app = {};

// config

app.config = {
  port: 3000,
};

// create server

app.createServer = () => {
  const server = http.createServer(reqres.handleReqRes);

  server.listen(env.port, () => {
    console.log(`${env.envName}:Listenning to port:${env.port}`);
  });
};

app.createServer();
