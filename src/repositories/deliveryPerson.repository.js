
const DeliveryPerson = require("../models/deliveryPerson.model");

class DeliveryPersonRepository {

    async insertMany(deliveryPersons) {
        return await DeliveryPerson.insertMany(deliveryPersons);
    }

    async getAll() {
        return await DeliveryPerson.find();
    }

    async getById(id) {
        return await DeliveryPerson.findById(id);
    }

    async create(deliveryPersonData) {
        return await DeliveryPerson.create(deliveryPersonData);
    }
}

module.exports = new DeliveryPersonRepository();