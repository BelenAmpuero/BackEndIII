const Delivery = require("../models/delivery.model.js");

require("../models/order.models.js");
require("../models/deliveryPerson.model.js");

class DeliveryRepository {

    async insertMany(deliveries) {
        return await Delivery.insertMany(deliveries);
    }

    async getAll(filter = {}, options = {}) {
        const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
        const skip = (page - 1) * limit;

        const deliveries = await Delivery.find(filter)
            .populate("order")
            .populate("deliveryPerson")
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalDocs = await Delivery.countDocuments(filter);
        const totalPages = Math.ceil(totalDocs / limit);

        return {
            docs: deliveries,
            totalDocs,
            limit: Number(limit),
            page: Number(page),
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
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

    async findPaginated(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await Delivery.find()
            .populate("order")
            .populate("deliveryPerson")
            .skip(skip)
            .limit(limit);
    }
}

module.exports = new DeliveryRepository();