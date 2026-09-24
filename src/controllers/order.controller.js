const orderService =
    require("../services/order.service");

const logger =
    require("../utils/logger/logger");


// GET ALL ORDERS

const getOrders = async (req, res, next) => {

    try {

        const result =
            await orderService.getOrders(
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


// GET ORDER BY ID

const getOrderById = async (req, res, next) => {

    try {

        const order =
            await orderService.getOrderById(
                req.params.id
            );

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

        const order =
            await orderService.createOrder(
                req.body
            );

        logger.info(
            `Pedido creado correctamente: ${order._id}`
        );

        res.status(201).json({
            status: "success",
            payload: order
        });

    } catch (error) {
        next(error);
    }
};


// UPDATE ORDER STATUS

const updateOrderStatus = async (req, res, next) => {

    try {

        const updatedOrder =
            await orderService.updateOrderStatus(
                req.params.id,
                req.body.status
            );

        logger.info(
            `Estado del pedido actualizado: ${req.params.id} → ${req.body.status}`
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