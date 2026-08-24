const express = require('express');

const app = express();

const errorHandler = require("./middlewares/errorHandler");
const loggerTestRouter = require("../src/routes/loggerTest.router.js");
const requestLogger = require("./middlewares/requestLogger.js")


// Middlewares globales básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);


// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '¡Servidor funcionando correctamente!' });
});

app.use("/api/loggerTest", loggerTestRouter);


const mocksRouter = require('./routes/mocks.router.js');
app.use('/api/mocks', mocksRouter);

app.use(errorHandler);
module.exports = app;