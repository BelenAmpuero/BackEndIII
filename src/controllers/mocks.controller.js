const {
    generateUsers,
    generateOrders,
    generateDeliveryPersons,
    generateDeliveries,
    generateSeedData
} = require("../services/mock.service.js");
const User = require("../models/user.model.js");
const Order = require("../models/order.models.js");
const DeliveryPerson = require("../models/deliveryPerson.model.js");
const Delivery = require("../models/delivery.model.js");

const getMockingUsers = (req, res) => {

    const qty = Number(req.query.qty) || 1;

    const users = generateUsers(qty);

    res.json({
        status: "success",
        payload: users
    });
};

    const getMockingOrders = (req, res) => {

    const qty = Number(req.query.qty) || 5;

    const users = generateUsers(qty);

    const userIds = users.map(user => user._id);

    const orders = generateOrders(userIds);

    res.json({
        status: "success",
        payload: orders
    });
};

const generateData = async (req, res) => {

    try {

        const qty = Number(req.query.qty);

if (!Number.isInteger(qty) || qty <= 0) {
  return res.status(400).json({
    status: "error",
    message: "El parámetro qty debe ser un número entero mayor que 0."
  });
}


        const result = await generateSeedData(qty);

        res.status(201).json({
            status: "success",
            message: "Datos de prueba generados correctamente",
            inserted: result
        });

    } catch (error) {

        res.status(500).json({
            status: "error",
            message: error.message
        });

    }

};

module.exports = {
    getMockingUsers,
    getMockingOrders,
    generateData
};