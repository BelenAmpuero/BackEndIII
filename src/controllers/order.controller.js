const mongoose = require("mongoose");

const orderRepository = require("../repositories/order.repository");
const userRepository = require("../repositories/users.repository");
const AppError = require("../utils/errors/appError");
const logger = require("../utils/logger/logger");

const {
    ORDER_STATUS,
    ORDER_PRIORITY
} = require("../utils/constants");


// GET ALL ORDERS

const getOrders = async (req, res, next) => {

    try {

        const orders = await orderRepository.getAll();

        res.json({
            status: "success",
            payload: orders
        });

    } catch (error) {

        next(error);

    }
};

// GET ORDER BY ID

const getOrderById = async (req, res, next) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("INVALID_ORDER_DATA");
        }

        const order = await orderRepository.getById(id);

        if (!order) {
            throw new AppError("ORDER_NOT_FOUND");
        }

        res.json({
            status: "success",
            payload: order
        });

    } catch (error) {

        next(error);

    }
};


// CREATE ORDER

const createOrder = async (req, res, next) => {

    try {

        const {
            user,
            items,
            deliveryAddress,
            status,
            priority
        } = req.body;


        // Validaciones básicas

        if (
            !user ||
            !Array.isArray(items) ||
            items.length === 0 ||
            !deliveryAddress
        ) {
            throw new AppError("INVALID_ORDER_DATA");
        }


        // Validar ObjectId del usuario

        if (!mongoose.Types.ObjectId.isValid(user)) {
            throw new AppError("INVALID_ORDER_DATA");
        }


        // Verificar que el usuario exista

        const existingUser = await userRepository.getById(user);

        if (!existingUser) {
            throw new AppError("INVALID_ORDER_DATA");
        }


        // Validar status si viene informado

        if (
            status !== undefined &&
            !Object.values(ORDER_STATUS).includes(status)
        ) {
            throw new AppError("INVALID_ORDER_STATUS");
        }


        // Validar priority si viene informado

        if (
            priority !== undefined &&
            !Object.values(ORDER_PRIORITY).includes(priority)
        ) {
            throw new AppError("INVALID_ORDER_DATA");
        }


        // Validar items

        for (const item of items) {

            if (
                !item.product ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                typeof item.price !== "number" ||
                item.price < 0
            ) {
                throw new AppError("INVALID_ORDER_DATA");
            }

        }


        // Calcular total

        const total = items.reduce(
            (sum, item) => sum + (item.quantity * item.price),
            0
        );


        const order = await orderRepository.create({
            user,
            items,
            total,
            deliveryAddress,
            status,
            priority
        });


        logger.info(`Pedido creado correctamente: ${order._id}`);


        res.status(201).json({
            status: "success",
            payload: order
        });

    } catch (error) {

        next(error);

    }
};


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

const updateOrderStatus = async (req, res, next) => {

    try {

        const { id } = req.params;
        const { status } = req.body;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("INVALID_ORDER_DATA");
        }


        if (!Object.values(ORDER_STATUS).includes(status)) {
            throw new AppError("INVALID_ORDER_STATUS");
        }


        const order = await orderRepository.getById(id);

        if (!order) {
            throw new AppError("ORDER_NOT_FOUND");
        }


        // No permitir modificar un pedido ya cancelado

        if (order.status === ORDER_STATUS.CANCELLED) {

            if (status === ORDER_STATUS.CANCELLED) {
                throw new AppError("ORDER_ALREADY_CANCELLED");
            }

            throw new AppError("ORDER_CANNOT_BE_CANCELLED");
        }


        const updatedOrder = await orderRepository.update(
            id,
            { status }
        );


        logger.info(
            `Estado del pedido actualizado: ${id} → ${status}`
        );


        res.json({
            status: "success",
            payload: updatedOrder
        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus
};