
const DeliveryPerson = require("../models/deliveryPerson.model");

class DeliveryPersonRepository {

    async insertMany(deliveryPersons) {

        try {
            const result = await DeliveryPerson.insertMany(deliveryPersons);

            return result;

        } catch (error) {

            throw error;
        }
    }

    async getAll() {
        return await DeliveryPerson.find();
    }

}

module.exports = new DeliveryPersonRepository();