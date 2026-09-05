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

        const page = Math.max(
            parseInt(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                parseInt(req.query.limit) || 10,
                1
            ),
            100
        );


        // ==========================================
        // FILTERS
        // ==========================================

        const filters = {};

        // Filter by availability
        if (req.query.isAvailable !== undefined) {

            if (
                req.query.isAvailable !== "true" &&
                req.query.isAvailable !== "false"
            ) {
                throw new AppError("INVALID_DELIVERY_PERSON");
            }

            filters.isAvailable =
                req.query.isAvailable === "true";
        }


        // Filter by vehicle type
        if (req.query.vehicle) {

            const validVehicles = [
                "moto",
                "bicycle",
                "car"
            ];

            if (!validVehicles.includes(req.query.vehicle)) {
                throw new AppError("INVALID_DELIVERY_PERSON");
            }

            filters["vehicle.kind"] =
                req.query.vehicle;
        }


        // ==========================================
        // SORTING
        // ==========================================

        const allowedSortFields = [
            "createdAt",
            "updatedAt",
            "isAvailable"
        ];

        const sortBy =
            req.query.sortBy || "createdAt";

        const sortOrder =
            req.query.sortOrder === "asc"
                ? 1
                : -1;


        if (!allowedSortFields.includes(sortBy)) {
            throw new AppError("INVALID_DELIVERY_PERSON");
        }


        const sort = {
            [sortBy]: sortOrder
        };


        // ==========================================
        // GET DATA
        // ==========================================

        const result =
            await deliveryPersonRepository.getPaginated({
                page,
                limit,
                filters,
                sort
            });


        // ==========================================
        // RESPONSE
        // ==========================================

        res.json({
            status: "success",
            payload: result
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