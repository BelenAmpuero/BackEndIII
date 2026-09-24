const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const deliveryPersonRepository =
    require("../repositories/deliveryPerson.repository");

const userRepository = require("../repositories/users.repository");
const AppError = require("../utils/errors/appError");

const { PAGINATION } = require("../utils/constants");

class DeliveryPersonService {

    // GET ALL DELIVERY PERSONS

    async getDeliveryPersons(query) {

        const {
            page,
            limit,
            isAvailable,
            vehicle,
            sortBy,
            sortOrder
        } = query;


        const pageNumber = Math.max(
            parseInt(page, 10) ||
                PAGINATION.DEFAULT_PAGE,
            1
        );

        const limitNumber = Math.min(
            Math.max(
                parseInt(limit, 10) ||
                    PAGINATION.DEFAULT_LIMIT,
                1
            ),
            PAGINATION.MAX_LIMIT
        );


        const filters = {};


        // FILTER BY AVAILABILITY

        if (isAvailable !== undefined) {

            if (
                isAvailable !== "true" &&
                isAvailable !== "false"
            ) {
                throw new AppError(
                    "INVALID_DELIVERY_PERSON"
                );
            }

            filters.isAvailable =
                isAvailable === "true";
        }


        // FILTER BY VEHICLE

        if (vehicle) {

            const validVehicles = [
                "moto",
                "bicycle",
                "car"
            ];

            if (!validVehicles.includes(vehicle)) {
                throw new AppError(
                    "INVALID_DELIVERY_PERSON"
                );
            }

            filters["vehicle.kind"] = vehicle;
        }


        // SORTING

        const allowedSortFields = [
            "createdAt",
            "updatedAt",
            "isAvailable"
        ];

        const sortField =
            sortBy || "createdAt";


        if (!allowedSortFields.includes(sortField)) {
            throw new AppError(
                "INVALID_DELIVERY_PERSON"
            );
        }


        const sortDirection =
            sortOrder === "asc"
                ? 1
                : -1;


        const sort = {
            [sortField]: sortDirection
        };


        return await deliveryPersonRepository.getPaginated({
            page: pageNumber,
            limit: limitNumber,
            filters,
            sort
        });
    }


    // GET DELIVERY PERSON BY ID

    async getDeliveryPersonById(id) {


        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError(
                "INVALID_DELIVERY_PERSON"
            );
        }


        const deliveryPerson =
            await deliveryPersonRepository.getById(id);



        if (!deliveryPerson) {
            throw new AppError(
                "DELIVERY_PERSON_NOT_FOUND"
            );
        }


        return deliveryPerson;
    }


    // CREATE DELIVERY PERSON

    async createDeliveryPerson(data) {

        const {
            user,
            vehicle,
            isAvailable,
            currentLocation
        } = data;


        if (
            !user ||
            !vehicle ||
            !vehicle.kind
        ) {
            throw new AppError(
                "INVALID_DELIVERY_PERSON"
            );
        }


        if (!mongoose.Types.ObjectId.isValid(user)) {
            throw new AppError(
                "INVALID_DELIVERY_PERSON"
            );
        }


        const existingUser =
            await userRepository.getById(user);


        if (!existingUser) {
            throw new AppError(
                "INVALID_DELIVERY_PERSON"
            );
        }


        const validVehicles = [
            "moto",
            "bicycle",
            "car"
        ];


        if (!validVehicles.includes(vehicle.kind)) {
            throw new AppError(
                "INVALID_DELIVERY_PERSON"
            );
        }


        return await deliveryPersonRepository.create({
            user,
            vehicle,
            isAvailable,
            currentLocation
        });
    }

}

module.exports = new DeliveryPersonService();