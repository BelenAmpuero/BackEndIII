const deliveryService =
    require("../services/delivery.service");

const logger =
    require("../utils/logger/logger");

const uploadService =
    require("../services/upload.service");


// GET ALL DELIVERIES

const getDeliveries = async (req, res, next) => {

    try {

        const result =
            await deliveryService.getDeliveries(
                req.query
            );

        res.json({
            status: "success",
            payload: result.docs,
            pagination: {
                totalDocs: result.totalDocs,
                limit: result.limit,
                page: result.page,
                totalPages: result.totalPages,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            }
        });

    } catch (error) {

        next(error);

    }
};


// GET DELIVERY BY ID

const getDeliveryById = async (req, res, next) => {

    try {

        const delivery =
            await deliveryService.getDeliveryById(
                req.params.id
            );

        res.json({
            status: "success",
            payload: delivery
        });

    } catch (error) {

        next(error);

    }
};


// CREATE DELIVERY

const createDelivery = async (req, res, next) => {

    try {

        const delivery =
            await deliveryService.createDelivery(
                req.body
            );

        logger.info(
            `Entrega creada correctamente: ${delivery._id}`
        );

        res.status(201).json({
            status: "success",
            payload: delivery
        });

    } catch (error) {

        next(error);

    }
};


// UPDATE DELIVERY STATUS

const updateDeliveryStatus = async (req, res, next) => {

    try {

        const updatedDelivery =
            await deliveryService.updateDeliveryStatus(
                req.params.id,
                req.body.status
            );

        logger.info(
            `Estado de entrega actualizado: ${req.params.id} → ${req.body.status}`
        );

        res.json({
            status: "success",
            payload: updatedDelivery
        });

    } catch (error) {

        next(error);

    }
};


// CREATE DELIVERY RECEIPT

const createDeliveryReceipt = async (req, res, next) => {

    try {

        const result =
            await uploadService.createDeliveryReceipt(
                req.params.id,
                req.file
            );

        res.status(201).json({
            status: "success",
            payload: result
        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    getDeliveries,
    getDeliveryById,
    createDelivery,
    updateDeliveryStatus,
    createDeliveryReceipt
};