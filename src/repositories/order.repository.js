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

}

module.exports = new OrderRepository();