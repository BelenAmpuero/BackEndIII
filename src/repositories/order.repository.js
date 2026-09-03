const Order = require("../models/order.models.js");

class OrderRepository {

    async insertMany(orders) {
        return await Order.insertMany(orders);
    }

    async getAll(filter = {}, options = {}) {
        const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
        const skip = (page - 1) * limit;

        const orders = await Order.find(filter)
            .populate("user", "name email")
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalDocs = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalDocs / limit);

        return {
            docs: orders,
            totalDocs,
            limit: Number(limit),
            page: Number(page),
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    }

    async getById(id) {
        return await Order.findById(id).populate("user", "name email");
    }

    async create(orderData) {
        return await Order.create(orderData);
    }

    async update(id, orderData) {
        return await Order.findByIdAndUpdate(
            id,
            orderData,
            {
                new: true,
                runValidators: true
            }
        );
    }

    async findPaginated(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await Order.find()
            .skip(skip)
            .limit(limit);
    }
}

module.exports = new OrderRepository();
