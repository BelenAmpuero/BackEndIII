const Delivery = require("../models/delivery.model.js");

require("../models/order.models.js");
require("../models/deliveryPerson.model.js");

class DeliveryRepository {

    async insertMany(deliveries) {
        return await Delivery.insertMany(deliveries);
    }

    async getAll() {
        return await Delivery.find()
            .populate("order")
            .populate("deliveryPerson");
    }

    async getById(id) {
        return await Delivery.findById(id)
            .populate("order")
            .populate("deliveryPerson");
    }

    async create(deliveryData) {
        return await Delivery.create(deliveryData);
    }

    async update(id, updateData) {
        return await Delivery.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("order")
            .populate("deliveryPerson");
    }
}

module.exports = new DeliveryRepository();