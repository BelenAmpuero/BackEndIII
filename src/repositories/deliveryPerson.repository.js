const DeliveryPerson = require("../models/deliveryPerson.model");
const { PAGINATION } = require("../utils/constants");

class DeliveryPersonRepository {

    // INSERT MANY

    async insertMany(deliveryPersons) {
        return await DeliveryPerson.insertMany(deliveryPersons);
    }


    // GET PAGINATED DELIVERY PERSONS

    async getPaginated({
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    filters = {},
    sort = {}
})  {

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


    // GET DELIVERY PERSON BY ID

    // async getById(id) {
    //     return await DeliveryPerson.findById(id);
    // }
async getById(id) {


    const result =
        await DeliveryPerson.findById(id);


    return result;
}
    // CREATE DELIVERY PERSON
    async create(deliveryPersonData) {
        return await DeliveryPerson.create(deliveryPersonData);
    }
}

module.exports = new DeliveryPersonRepository();
