const express = require('express');

const app = express();

const usersRouter = require ("./routes/user.router.js")
const ordersRouter = require("./routes/order.router.js");
const deliveryPersonRouter = require("./routes/deliveryPerson.router.js");
const deliveryRouter = require("./routes/delivery.router.js");
const errorHandler = require("./middlewares/errorHandler");
const loggerTestRouter = require("../src/routes/loggerTest.router.js");
const requestLogger = require("./middlewares/requestLogger.js")
const AppError = require("./utils/errors/appError");

const swaggerUi = require ("swagger-ui-express");
const { swaggerSpecs } = require ("./docs/swagger.config.js");


// Middlewares globales básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

// Documentación Swagger

app.get("/api/docs-json", (req, res) => {
  res.json(swaggerSpecs);
});

app.get("/api/health", (req, res) => {
  
  res.json({
    status: "OK",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    timestamp: new Date()
  }); 
});

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: "/api/docs-json",
    },
  })
);

// RUTA PRINCIPAL

app.get('/', (req, res) => {
  res.json({ message: '¡Servidor funcionando correctamente!' });
});


// USERS

app.use("/api/users", usersRouter);

// ORDER

app.use("/api/orders", ordersRouter);

// DELIVERY

app.use("/api/deliveryPersons", deliveryPersonRouter);

app.use("/api/deliveries", deliveryRouter);

// Ruta de prueba LOGGER

app.use("/api/loggerTest", loggerTestRouter);

// MOCKS

const mocksRouter = require('./routes/mocks.router.js');

app.use('/api/mocks', mocksRouter);

app.use((req, res, next) => {
  next(new AppError("ROUTE_NOT_FOUND"));
});

// ERR HANDLER

app.use(errorHandler);
module.exports = app;