const fs = require("fs/promises");
const mongoose = require("mongoose");

const userRepository = require("../repositories/users.repository");
const deliveryRepository = require("../repositories/delivery.repository");
const documentRepository = require("../repositories/document.repository");

const AppError = require("../utils/errors/appError");
const logger = require("../utils/logger/logger");

const { DOCUMENT_TYPES } = require("../utils/constants");


const createUserDocument = async (userId, documentType, file) => {

    if (!file) {
        throw new AppError("FILE_REQUIRED");
    }

    const user = await userRepository.getById(userId);

    if (!user) {
        await fs.unlink(file.path).catch(() => {});
        throw new AppError("USER_NOT_FOUND");
    }

    const allowedDocumentTypes = [
        DOCUMENT_TYPES.USER_DOCUMENT,
        DOCUMENT_TYPES.DRIVER_LICENSE
    ];

    if (!allowedDocumentTypes.includes(documentType)) {
        await fs.unlink(file.path).catch(() => {});
        throw new AppError("INVALID_DOCUMENT_TYPE");
    }

    try {

        const document = await documentRepository.create({
            originalName: file.originalname,
            fileName: file.filename,
            path: file.path,
            mimeType: file.mimetype,
            size: file.size,
            documentType
        });

        user.documents.push(document._id);

        await user.save();

        logger.info(
            `Documento de usuario cargado correctamente: ${document._id}`
        );

        return {
            user,
            document
        };

    } catch (error) {

        await fs.unlink(file.path).catch(() => {});

        throw new AppError("DOCUMENT_SAVE_ERROR");
    }
};


const createDeliveryReceipt = async (deliveryId, file) => {

    if (!file) {
        throw new AppError("FILE_REQUIRED");
    }

    if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
    await fs.unlink(file.path).catch(() => {});
    throw new AppError("INVALID_DELIVERY_DATA");
}

    const delivery = await deliveryRepository.getById(deliveryId);

    if (!delivery) {
        await fs.unlink(file.path).catch(() => {});
        throw new AppError("DELIVERY_NOT_FOUND");
    }

    try {

        const document = await documentRepository.create({
            originalName: file.originalname,
            fileName: file.filename,
            path: file.path,
            mimeType: file.mimetype,
            size: file.size,
            documentType: DOCUMENT_TYPES.DELIVERY_PROOF
        });

        delivery.receipt = document._id;

        await delivery.save();

        logger.info(
            `Comprobante asociado a la entrega: ${deliveryId}`
        );

        return {
            delivery,
            document
        };

    } catch (error) {

        await fs.unlink(file.path).catch(() => {});

        throw new AppError("DOCUMENT_SAVE_ERROR");
    }
};


module.exports = {
    createUserDocument,
    createDeliveryReceipt
};