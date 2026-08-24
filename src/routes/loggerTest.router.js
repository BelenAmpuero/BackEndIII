const express = require("express");

const router = express.Router();

// Importamos nuestro logger
const logger = require("../utils/logger/logger.js");

// DEBUG
router.get("/debug", (req, res) => {
  logger.debug("Mensaje de prueba - DEBUG");

  res.json({
    status: "success",
    message: "Log DEBUG generado correctamente"
  });
});

// HTTP
router.get("/http", (req, res) => {
  logger.http("Mensaje de prueba - HTTP");

  res.json({
    status: "success",
    message: "Log HTTP generado correctamente"
  });
});

// INFO
router.get("/info", (req, res) => {
  logger.info("Mensaje de prueba - INFO");

  res.json({
    status: "success",
    message: "Log INFO generado correctamente"
  });
});

// WARNING
router.get("/warn", (req, res) => {
  logger.warning("Mensaje de prueba - WARNING");

  res.json({
    status: "success",
    message: "Log WARNING generado correctamente"
  });
});

// ERROR
router.get("/error", (req, res) => {
  logger.error("Mensaje de prueba - ERROR");

  res.json({
    status: "success",
    message: "Log ERROR generado correctamente"
  });
});

// FATAL
router.get("/fatal", (req, res) => {
  logger.fatal("Mensaje de prueba - FATAL");

  res.json({
    status: "success",
    message: "Log FATAL generado correctamente"
  });
});

module.exports = router;