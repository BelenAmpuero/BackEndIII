const mongoose = require("mongoose");

const deliveryRepository =
    require("../repositories/delivery.repository");

const orderRepository =
    require("../repositories/order.repository");

const deliveryPersonRepository =
    require("../repositories/deliveryPerson.repository");

const AppError = require("../utils/errors/appError");
const logger = require("../utils/logger/logger");

const {
    DELIVERY_STATUS
} = require("../utils/constants");


// ==========================================
// GET ALL DELIVERIES
// ==========================================

const getDeliveries = async (req, res, next) => {

    try {

        const deliveries =
            await deliveryRepository.getAll();

        res.json({
            status: "success",
            payload: deliveries
        });

    } catch (error) {

        next(error);

    }
};


// ==========================================
// GET DELIVERY BY ID
// ==========================================

const getDeliveryById = async (req, res, next) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("INVALID_DELIVERY_DATA");
        }

        const delivery =
            await deliveryRepository.getById(id);

        if (!delivery) {
            throw new AppError("DELIVERY_NOT_FOUND");
        }

        res.json({
            status: "success",
            payload: delivery
        });

    } catch (error) {

        next(error);

    }
};


// ==========================================
// CREATE DELIVERY
// ==========================================

const createDelivery = async (req, res, next) => {

    try {

        const {
            order,
            deliveryPerson,
            status
        } = req.body;


        if (!order || !deliveryPerson) {
            console.log("Falta order o deliveryPerson");


            throw new AppError("DELIVERY_ASSIGNMENT_FAILED");
        }

        if (
            !mongoose.Types.ObjectId.isValid(order) ||
            !mongoose.Types.ObjectId.isValid(deliveryPerson)
        ) {

            throw new AppError("DELIVERY_ASSIGNMENT_FAILED");
        }


        // Verificar pedido

        const existingOrder =
            await orderRepository.getById(order);

        if (!existingOrder) {

            throw new AppError("DELIVERY_ASSIGNMENT_FAILED");
        }


        // Verificar repartidor

        const existingDeliveryPerson =
            await deliveryPersonRepository.getById(
                deliveryPerson
            );

        if (!existingDeliveryPerson) {

            throw new AppError("DELIVERY_PERSON_NOT_FOUND");
        }

        // Verificar disponibilidad

        if (!existingDeliveryPerson.isAvailable) {

            throw new AppError("DELIVERY_PERSON_NOT_AVAILABLE");
        }


        // Validar estado

        if (
            status !== undefined &&
            !Object.values(DELIVERY_STATUS).includes(status)
        ) {

            throw new AppError("INVALID_DELIVERY_STATUS");
        }


        const delivery =
            await deliveryRepository.create({
                order,
                deliveryPerson,
                status
            });


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


// ==========================================
// UPDATE DELIVERY STATUS
// ==========================================

const updateDeliveryStatus = async (req, res, next) => {

    try {

        const { id } = req.params;
        const { status } = req.body;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("INVALID_DELIVERY_STATUS");
        }


        if (!Object.values(DELIVERY_STATUS).includes(status)) {
            throw new AppError("INVALID_DELIVERY_STATUS");
        }


        const delivery =
            await deliveryRepository.getById(id);

        if (!delivery) {
            throw new AppError("DELIVERY_NOT_FOUND");
        }


        if (
            delivery.status === DELIVERY_STATUS.COMPLETED
        ) {
            throw new AppError("DELIVERY_ALREADY_COMPLETED");
        }


        const updateData = {
            status
        };


        if (status === DELIVERY_STATUS.COMPLETED) {
            updateData.deliveredAt = new Date();
        }


        const updatedDelivery =
            await deliveryRepository.update(
                id,
                updateData
            );


        logger.info(
            `Estado de entrega actualizado: ${id} → ${status}`
        );


        res.json({
            status: "success",
            payload: updatedDelivery
        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    getDeliveries,
    getDeliveryById,
    createDelivery,
    updateDeliveryStatus
};