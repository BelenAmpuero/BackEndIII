const Order = require("../models/order.models.js");

class OrderRepository {

    async insertMany(orders) {
        return await Order.insertMany(orders);
    }

    async getAll() {
        return await Order.find();
    }

    async getById(id) {
        return await Order.findById(id);
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

}

module.exports = new OrderRepository();
