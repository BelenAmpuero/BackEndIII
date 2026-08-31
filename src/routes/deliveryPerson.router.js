const { Router } = require("express");

const {
    getDeliveryPersons,
    getDeliveryPersonById,
    createDeliveryPerson
} = require("../controllers/deliveryPerson.controller.js");

const router = Router();

router.get("/", getDeliveryPersons);

router.get("/:id", getDeliveryPersonById);

router.post("/", createDeliveryPerson);

module.exports = router;