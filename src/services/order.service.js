const mongoose = require("mongoose");

const orderRepository =
    require("../repositories/order.repository");

const userRepository =
    require("../repositories/users.repository");

const AppError =
    require("../utils/errors/appError");

const {
    ORDER_STATUS,
    ORDER_PRIORITY,
    PAGINATION
} = require("../utils/constants");


class OrderService {

    // GET ALL ORDERS

    async getOrders(query) {

        const {
            page,
            limit,
            status,
            priority,
            user
        } = query;

        const filter = {};

        // Validar status

        if (status) {

            if (
                !Object.values(ORDER_STATUS)
                    .includes(status)
            ) {
                throw new AppError(
                    "INVALID_ORDER_STATUS"
                );
            }

            filter.status = status;
        }

        // Validar priority

        if (priority) {

            if (
                !Object.values(ORDER_PRIORITY)
                    .includes(priority)
            ) {
                throw new AppError(
                    "INVALID_ORDER_DATA"
                );
            }

            filter.priority = priority;
        }

        // Validar usuario

        if (user) {

            if (
                !mongoose.Types.ObjectId.isValid(user)
            ) {
                throw new AppError(
                    "INVALID_USER_DATA"
                );
            }

            filter.user = user;
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

        return await orderRepository.getAll(
            filter,
            options
        );
    }


    // GET ORDER BY ID

    async getOrderById(id) {

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            throw new AppError(
                "INVALID_ORDER_DATA"
            );
        }

        const order =
            await orderRepository.getById(id);

        if (!order) {
            throw new AppError(
                "ORDER_NOT_FOUND"
            );
        }

        return order;
    }


    // CREATE ORDER

    async createOrder(data) {

        const {
            user,
            items,
            deliveryAddress,
            status,
            priority
        } = data;

        // Validaciones básicas

        if (
            !user ||
            !Array.isArray(items) ||
            items.length === 0 ||
            !deliveryAddress
        ) {
            throw new AppError(
                "INVALID_ORDER_DATA"
            );
        }

        // Validar ID del usuario

        if (
            !mongoose.Types.ObjectId.isValid(user)
        ) {
            throw new AppError(
                "INVALID_ORDER_DATA"
            );
        }

        // Verificar que el usuario exista

        const existingUser =
            await userRepository.getById(user);

        if (!existingUser) {
            throw new AppError(
                "INVALID_ORDER_DATA"
            );
        }

        // Validar status

        if (
            status !== undefined &&
            !Object.values(ORDER_STATUS)
                .includes(status)
        ) {
            throw new AppError(
                "INVALID_ORDER_STATUS"
            );
        }

        // Validar priority

        if (
            priority !== undefined &&
            !Object.values(ORDER_PRIORITY)
                .includes(priority)
        ) {
            throw new AppError(
                "INVALID_ORDER_DATA"
            );
        }

        // Validar items

        for (const item of items) {

            if (
                !item.product ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                typeof item.price !== "number" ||
                item.price < 0
            ) {
                throw new AppError(
                    "INVALID_ORDER_DATA"
                );
            }
        }

        // Calcular total

        const total = items.reduce(
            (sum, item) =>
                sum + (item.quantity * item.price),
            0
        );

        // Crear pedido

        return await orderRepository.create({
            user,
            items,
            total,
            deliveryAddress,
            status,
            priority
        });
    }


    // UPDATE ORDER STATUS

    async updateOrderStatus(id, status) {

        // Validar ID

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            throw new AppError(
                "INVALID_ORDER_DATA"
            );
        }

        // Validar status

        if (
            !Object.values(ORDER_STATUS)
                .includes(status)
        ) {
            throw new AppError(
                "INVALID_ORDER_STATUS"
            );
        }

        // Buscar pedido

        const order =
            await orderRepository.getById(id);

        if (!order) {
            throw new AppError(
                "ORDER_NOT_FOUND"
            );
        }

        // Regla de negocio:
        // un pedido cancelado no puede
        // cambiar a otro estado.

        if (
            order.status ===
            ORDER_STATUS.CANCELLED
        ) {

            if (
                status === ORDER_STATUS.CANCELLED
            ) {
                throw new AppError(
                    "ORDER_ALREADY_CANCELLED"
                );
            }

            throw new AppError(
                "ORDER_CANNOT_BE_CANCELLED"
            );
        }

        return await orderRepository.update(
            id,
            { status }
        );
    }
}


module.exports = new OrderService();