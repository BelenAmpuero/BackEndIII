const orderService = require("../services/order.service.js");

const getOrderById = async (req, res, next) => {

    try {

        const order = await orderService.getById(req.params.id);

        res.json({
            status: "success",
            payload: order
        });

    } catch (error) {
        next(error);
    }
};

const getOrders = async (req, res, next) => {

    try {

        const orders = await orderService.getAll();

        res.json({
            status: "success",
            payload: orders
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getOrderById,
    getOrders
};