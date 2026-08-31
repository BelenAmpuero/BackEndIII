const {
    generateUsers,
    generateOrders,
    generateSeedData
} = require("../services/mock.service.js");
const logger = require("../utils/logger/logger");
const getMockingUsers = (req, res, next) => {

    try {

        const qty = req.query.qty === undefined
            ? 1
            : Number(req.query.qty);

        logger.info(`Generando ${qty} usuarios mock`);

        const users = generateUsers(qty);

        logger.info(`Usuarios mock generados correctamente: ${users.length}`);

        res.json({
            status: "success",
            payload: users
        });

    } catch (error) {
        next(error);
    }
};

    const getMockingOrders = (req, res, next ) => {

        try {
    const qty = req.query.qty === undefined
    ? 5
    : Number (req.query.qty);

    logger.info(`Generando ${qty} pedidos mock`);

    const users = generateUsers(qty);

    const userIds = users.map(user => user._id);

    const orders = generateOrders(userIds);

    res.json({
        status: "success",
        payload: orders
    });
} catch (error) {
next(error);
}
};

const generateData = async (req, res, next) => {

    try {

        const qty = req.query.qty === undefined
        ? 10
        : Number (req.query.qty);

        logger.info(`Generando datos de prueba. Cantidad: ${qty}`);

        const result = await generateSeedData(qty);

        logger.info("Datos de prueba generados correctamente");

        res.status(201).json({
            status: "success",
            message: "Datos de prueba generados correctamente",
            inserted: result
        });

    } catch (error) {

        next (error);

    }

};

module.exports = {
    getMockingUsers,
    getMockingOrders,
    generateData
};