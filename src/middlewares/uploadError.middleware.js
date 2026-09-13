const multer = require("multer");
const AppError = require("../utils/errors/appError");
const logger = require("../utils/logger/logger");

const uploadErrorHandler = (uploadMiddleware) => {

    return (req, res, next) => {

        uploadMiddleware(req, res, (error) => {

            if (!error) {
                return next();
            }

            if (error instanceof multer.MulterError) {

                logger.warning(
                    `Error de Multer durante la carga: ${error.code}`
                );

                if (error.code === "LIMIT_FILE_SIZE") {
                    return next(new AppError("FILE_TOO_LARGE"));
                }

                if (error.code === "LIMIT_UNEXPECTED_FILE") {
                    return next(new AppError("INVALID_FILE_FIELD"));
                }

                return next(new AppError("FILE_SAVE_ERROR"));
            }

            if (error.message === "INVALID_FILE_TYPE") {

                logger.warning(
                    `Intento de cargar un tipo de archivo no permitido: ${req.file?.originalname || "archivo desconocido"}`
                );

                return next(new AppError("INVALID_FILE_TYPE"));
            }

            logger.warning(
                `Error durante la carga de archivo: ${error.message}`
            );

            next(error);
        });
    };
};

module.exports = uploadErrorHandler;