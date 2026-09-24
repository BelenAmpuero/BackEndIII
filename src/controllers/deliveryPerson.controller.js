const deliveryPersonService =
    require("../services/deliveryPerson.service");

const logger =
    require("../utils/logger/logger");


// GET ALL DELIVERY PERSONS

const getDeliveryPersons = async (req, res, next) => {

    try {

        const result =
            await deliveryPersonService.getDeliveryPersons(
                req.query
            );

        res.json({
            status: "success",
            payload: result
        });

    } catch (error) {

        next(error);

    }
};


// GET DELIVERY PERSON BY ID

const getDeliveryPersonById = async (req, res, next) => {

    try {

        const deliveryPerson =
            await deliveryPersonService.getDeliveryPersonById(
                req.params.id
            );

        res.json({
            status: "success",
            payload: deliveryPerson
        });

    } catch (error) {

        next(error);

    }
};


// CREATE DELIVERY PERSON

const createDeliveryPerson = async (req, res, next) => {

    try {

        const deliveryPerson =
            await deliveryPersonService.createDeliveryPerson(
                req.body
            );

        logger.info(
            `Repartidor creado correctamente: ${deliveryPerson._id}`
        );

        res.status(201).json({
            status: "success",
            payload: deliveryPerson
        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    getDeliveryPersons,
    getDeliveryPersonById,
    createDeliveryPerson
};