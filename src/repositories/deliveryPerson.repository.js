const DeliveryPerson = require("../models/deliveryPerson.model");

class DeliveryPersonRepository {

    // ==========================================
    // INSERT MANY
    // ==========================================

    async insertMany(deliveryPersons) {
        return await DeliveryPerson.insertMany(deliveryPersons);
    }


    // ==========================================
    // GET PAGINATED DELIVERY PERSONS
    // ==========================================

    async getPaginated({
        page = 1,
        limit = 10,
        filters = {},
        sort = {}
    }) {

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([

            DeliveryPerson.find(filters)
                .sort(sort)
                .skip(skip)
                .limit(limit),

            DeliveryPerson.countDocuments(filters)

        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }


    // ==========================================
    // GET DELIVERY PERSON BY ID
    // ==========================================

    async getById(id) {
        return await DeliveryPerson.findById(id);
    }


    // ==========================================
    // CREATE DELIVERY PERSON
    // ==========================================

    async create(deliveryPersonData) {
        return await DeliveryPerson.create(deliveryPersonData);
    }
}

module.exports = new DeliveryPersonRepository();
