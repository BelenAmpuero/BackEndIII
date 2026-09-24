const mongoose = require("mongoose");

const deliveryRepository =
    require("../repositories/delivery.repository");

const orderRepository =
    require("../repositories/order.repository");

const deliveryPersonRepository =
    require("../repositories/deliveryPerson.repository");

const AppError =
    require("../utils/errors/appError");

const {
    DELIVERY_STATUS,
    PAGINATION
} = require("../utils/constants");


class DeliveryService {

    // GET ALL DELIVERIES

    async getDeliveries(query) {

        const {
            page,
            limit,
            status,
            deliveryPerson,
            order
        } = query;

        const filter = {};

        // Validar estado

        if (status) {

            if (
                !Object.values(DELIVERY_STATUS)
                    .includes(status)
            ) {
                throw new AppError(
                    "INVALID_DELIVERY_STATUS"
                );
            }

            filter.status = status;
        }

        // Validar repartidor

        if (deliveryPerson) {

            if (
                !mongoose.Types.ObjectId.isValid(
                    deliveryPerson
                )
            ) {
                throw new AppError(
                    "DELIVERY_PERSON_NOT_FOUND"
                );
            }

            filter.deliveryPerson =
                deliveryPerson;
        }

        // Validar pedido

        if (order) {

            if (
                !mongoose.Types.ObjectId.isValid(order)
            ) {
                throw new AppError(
                    "INVALID_DELIVERY_DATA"
                );
            }

            filter.order = order;
        }

        // Paginación

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

        const options = {
            page: pageNumber,
            limit: limitNumber
        };

        return await deliveryRepository.getAll(
            filter,
            options
        );
    }


    // GET DELIVERY BY ID

    async getDeliveryById(id) {

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            throw new AppError(
                "INVALID_DELIVERY_DATA"
            );
        }

        const delivery =
            await deliveryRepository.getById(id);

        if (!delivery) {
            throw new AppError(
                "DELIVERY_NOT_FOUND"
            );
        }

        return delivery;
    }


    // CREATE DELIVERY

    async createDelivery(data) {

        const {
            order,
            deliveryPerson,
            status
        } = data;

        // Validaciones básicas

        if (!order || !deliveryPerson) {

            throw new AppError(
                "DELIVERY_ASSIGNMENT_FAILED"
            );
        }

        // Validar IDs

        if (
            !mongoose.Types.ObjectId.isValid(order) ||
            !mongoose.Types.ObjectId.isValid(
                deliveryPerson
            )
        ) {

            throw new AppError(
                "DELIVERY_ASSIGNMENT_FAILED"
            );
        }

        // Verificar pedido

        const existingOrder =
            await orderRepository.getById(order);

        if (!existingOrder) {

            throw new AppError(
                "DELIVERY_ASSIGNMENT_FAILED"
            );
        }

        // Verificar repartidor

        const existingDeliveryPerson =
            await deliveryPersonRepository.getById(
                deliveryPerson
            );

        if (!existingDeliveryPerson) {

            throw new AppError(
                "DELIVERY_PERSON_NOT_FOUND"
            );
        }

        // Verificar disponibilidad

        if (!existingDeliveryPerson.isAvailable) {

            throw new AppError(
                "DELIVERY_PERSON_NOT_AVAILABLE"
            );
        }

        // Validar estado

        if (
            status !== undefined &&
            !Object.values(DELIVERY_STATUS)
                .includes(status)
        ) {

            throw new AppError(
                "INVALID_DELIVERY_STATUS"
            );
        }

        // Crear entrega

        return await deliveryRepository.create({
            order,
            deliveryPerson,
            status
        });
    }


    // UPDATE DELIVERY STATUS

    async updateDeliveryStatus(id, status) {

        // Validar ID

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            throw new AppError(
                "INVALID_DELIVERY_STATUS"
            );
        }

        // Validar estado

        if (
            !Object.values(DELIVERY_STATUS)
                .includes(status)
        ) {

            throw new AppError(
                "INVALID_DELIVERY_STATUS"
            );
        }

        // Buscar entrega

        const delivery =
            await deliveryRepository.getById(id);

        if (!delivery) {

            throw new AppError(
                "DELIVERY_NOT_FOUND"
            );
        }

        // Una entrega completada
        // no puede volver a modificarse.

        if (
            delivery.status ===
            DELIVERY_STATUS.COMPLETED
        ) {

            throw new AppError(
                "DELIVERY_ALREADY_COMPLETED"
            );
        }

        const updateData = {
            status
        };

        // Si pasa a completada,
        // registrar fecha.

        if (
            status ===
            DELIVERY_STATUS.COMPLETED
        ) {

            updateData.deliveredAt =
                new Date();
        }

        return await deliveryRepository.update(
            id,
            updateData
        );
    }
}


module.exports = new DeliveryService();