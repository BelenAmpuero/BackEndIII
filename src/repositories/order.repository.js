const Order = require("../models/order.models.js");

class OrderRepository {

    async insertMany(orders) {
        return await Order.insertMany(orders);
    }

    async getAll() {
        return await Order.find();
    }

}

module.exports = new OrderRepository();