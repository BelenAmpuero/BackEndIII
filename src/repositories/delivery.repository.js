const Delivery = require("../models/delivery.model.js");

class DeliveryRepository {

    async insertMany(deliveries) {
        return await Delivery.insertMany(deliveries);
    }

    async getAll() {
        return await Delivery.find();
    }

}

module.exports = new DeliveryRepository();