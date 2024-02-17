const env = {};

env.staging = {
  port: 3000,
  envName: "Stageing",
  key: "stageing453452jfkldasf ndsajfdash54u3jeiwj",
  maxChecks: 5,
};

env.production = {
  port: 4000,
  envName: "Production",
  key: "production4455jkljskdltrfjlkdsajb vjdsklafj",
  maxChecks: 5,
};

const currenEnv =
  typeof process.env.mode === "string" ? process.env.mode : "staging";

const envToExport =
  typeof env[currenEnv] === "object" ? env[currenEnv] : env.staging;

module.exports = envToExport;
