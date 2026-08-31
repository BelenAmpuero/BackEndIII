const { Router } = require("express");

const {
    getDeliveries,
    getDeliveryById,
    createDelivery,
    updateDeliveryStatus
} = require("../controllers/delivery.controller");

const router = Router();

router.get("/", getDeliveries);

router.get("/:id", getDeliveryById);

router.post("/", createDelivery);

router.patch("/:id/status", updateDeliveryStatus);

module.exports = router;