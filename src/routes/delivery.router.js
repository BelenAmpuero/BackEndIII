const { Router } = require("express");

const {
    getDeliveries,
    getDeliveryById,
    createDelivery,
    updateDeliveryStatus,
    createDeliveryReceipt
} = require("../controllers/delivery.controller");

const {
    uploadDeliveryReceipt
} = require("../config/multer.config");

const uploadErrorHandler =
    require("../middlewares/uploadError.middleware");

const router = Router();

router.get("/", getDeliveries);

router.get("/:id", getDeliveryById);

router.post("/", createDelivery);

router.patch("/:id/status", updateDeliveryStatus);

router.post(
    "/:id/receipt",
    uploadErrorHandler(
        uploadDeliveryReceipt.single("file")
    ),
    createDeliveryReceipt
);

module.exports = router;