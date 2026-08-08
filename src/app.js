const express = require('express');

const app = express();

// Middlewares globales básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '¡Servidor funcionando correctamente!' });
});

const mocksRouter = require('./routes/mocks.router.js');
app.use('/api/mocks', mocksRouter);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: '404 Not Found' });
});

module.exports = app;