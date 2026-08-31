const { Router } = require("express");

const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus
} = require("../controllers/order.controller");

const router = Router();

router.get("/", getOrders);

router.get("/:id", getOrderById);

router.post("/", createOrder);

router.patch("/:id/status", updateOrderStatus);

module.exports = router;
