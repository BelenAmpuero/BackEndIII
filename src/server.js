const app = require("./app");
const connectDB = require("./config/db");
const { PORT, MONGODB_URI } = require("./config/env.config");
const logger = require("./utils/logger/logger");

// 1. Validar variables de entorno críticas antes de arrancar
if (!PORT || !MONGODB_URI) {
    logger.error("❌ Error crítico: Faltan variables de entorno obligatorias (PORT o MONGO_URI).");
    process.exit(1);
}

let server;

process.on('SIGTERM', () => {
    logger.info('Finalizando proceso...');

    if (server) {
        server.close(() => {
            logger.info('Servidor cerrado correctamente');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

const startServer = async () => {
    try {
        await connectDB();

        server = app.listen(PORT, () => {
            logger.info(`🚀 Servidor escuchando en el puerto ${PORT}`);
        });

    } catch (error) {
        logger.error(`❌ Error al iniciar el servidor: ${error.message}`);
        process.exit(1);
    }
};

startServer();