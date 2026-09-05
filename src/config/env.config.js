const dotenv = require("dotenv");
const path = require("path");

const NODE_ENV = process.env.NODE_ENV || "development";

if (NODE_ENV === "test") {
  dotenv.config({
    path: path.resolve(process.cwd(), ".env.test")
  });
} else {
  dotenv.config();
}

const isProd = NODE_ENV === "production";
const isTest = NODE_ENV === "test";
const isDev = NODE_ENV === "development";

const logLevel =
  process.env.LOG_LEVEL || (isProd ? "info" : "debug");

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV,
  isProd,
  isTest,
  isDev,
  logLevel
};