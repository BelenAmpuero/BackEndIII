const AppError = require('../utils/errors/appError');
const logger = require('../utils/logger/logger');

const errorHandler = (err, req, res, next) => {

    if (err instanceof AppError) {
        const logData = {
            code: err.code,
            status: err.status,
            method: req.method,
            path: req.originalUrl
        };

        if (err.status >= 500) {
            logger.error(`Error del servidor: ${err.message}`, logData);
        } else {
            logger.warning(`Error de aplicación: ${err.message}`, logData);
        }
        
        return res.status(err.status).json({
            status: "error",
            code: err.code,
            message: err.message
        });
    }

    logger.error(`Error inesperado: ${err.message}`, {
        method: req.method,
        path: req.originalUrl,
        stack: err.stack
    });

    logger.fatal(`Error interno del servidor: ${err.message}`, {
        method: req.method,
        path: req.originalUrl,
        stack: err.stack
    });
};

module.exports = errorHandler;