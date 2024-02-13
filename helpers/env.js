const env = {};

env.staging = {
  port: 3000,
  envName: "Stageing",
  key: "stageing453452jfkldasf ndsajfdash54u3jeiwj",
};

env.production = {
  port: 4000,
  envName: "Production",
  key: "production4455jkljskdltrfjlkdsajb vjdsklafj",
};

const currenEnv =
  typeof process.env.mode === "string" ? process.env.mode : "staging";

const envToExport =
  typeof env[currenEnv] === "object" ? env[currenEnv] : env.staging;

module.exports = envToExport;
