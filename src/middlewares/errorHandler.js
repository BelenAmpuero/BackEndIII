const AppError = require('../utils/errors/appError');

const errorHandler = (err, req, res, next) => {

    if (err instanceof AppError) {
        return res.status(err.status).json({
            status: "error",
            code: err.code,
            message: err.message
        });
    }

    console.error(err);

    return res.status(500).json({
        status: "error",
        code: "INTERNAL_SERVER_ERROR",
        message: "Error interno del servidor"
    });
};

module.exports = errorHandler;