require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

const logLevel =
  process.env.LOG_LEVEL || (isProd ? "info" : "debug");

const requiredEnv = ["PORT", "MONGODB_URI"];

requiredEnv.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Falta la variable de entorno: ${envVar}`);
  }
});

console.log("ENV CONFIG CARGADO");
console.log("isProd dentro de env.config:", isProd);
console.log("logLevel dentro de env.config:", logLevel);

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV || "development",
  isProd,
  logLevel
};