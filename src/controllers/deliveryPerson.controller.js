const mongoose = require("mongoose");

const deliveryPersonRepository =
    require("../repositories/deliveryPerson.repository");

const userRepository =
    require("../repositories/users.repository");

const AppError =
    require("../utils/errors/appError");

const logger =
    require("../utils/logger/logger");


// ==========================================
// GET ALL DELIVERY PERSONS
// ==========================================

const getDeliveryPersons = async (req, res, next) => {

    try {

        const deliveryPersons =
            await deliveryPersonRepository.getAll();

        res.json({
            status: "success",
            payload: deliveryPersons
        });

    } catch (error) {

        next(error);

    }
};


// ==========================================
// GET DELIVERY PERSON BY ID
// ==========================================

const getDeliveryPersonById = async (req, res, next) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("INVALID_DELIVERY_PERSON");
        }

        const deliveryPerson =
            await deliveryPersonRepository.getById(id);

        if (!deliveryPerson) {
            throw new AppError("DELIVERY_PERSON_NOT_FOUND");
        }

        res.json({
            status: "success",
            payload: deliveryPerson
        });

    } catch (error) {

        next(error);

    }
};


// ==========================================
// CREATE DELIVERY PERSON
// ==========================================

const createDeliveryPerson = async (req, res, next) => {

    try {

        const {
            user,
            vehicle,
            isAvailable,
            currentLocation
        } = req.body;


        if (
            !user ||
            !vehicle ||
            !vehicle.kind
        ) {
            throw new AppError("INVALID_DELIVERY_PERSON");
        }


        if (!mongoose.Types.ObjectId.isValid(user)) {
            throw new AppError("INVALID_DELIVERY_PERSON");
        }


        const existingUser =
            await userRepository.getById(user);


        if (!existingUser) {
            throw new AppError("INVALID_DELIVERY_PERSON");
        }


        const validVehicles = [
            "moto",
            "bicycle",
            "car"
        ];


        if (!validVehicles.includes(vehicle.kind)) {
            throw new AppError("INVALID_DELIVERY_PERSON");
        }


        const deliveryPerson =
            await deliveryPersonRepository.create({
                user,
                vehicle,
                isAvailable,
                currentLocation
            });


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