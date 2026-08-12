const express = require('express');

const app = express();

const errorHandler = require("./middlewares/errorHandler");

// Middlewares globales básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '¡Servidor funcionando correctamente!' });
});

const mocksRouter = require('./routes/mocks.router.js');
app.use('/api/mocks', mocksRouter);

app.use(errorHandler);
module.exports = app;