const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const VEHICLES = ["moto", "bicycle", "car"];

const generateMockDeliveryPerson = (userId) => {
  return {
    _id: new mongoose.Types.ObjectId(),

    user: userId,

    vehicle: {
      kind: faker.helpers.arrayElement(VEHICLES),
      plate: faker.vehicle.vrm()
    },

    isAvailable: faker.datatype.boolean(),

    currentLocation: {
      lat: Number(faker.location.latitude()),
      lng: Number(faker.location.longitude())
    }
  };
};

const generateMockDeliveryPersons = (userIds = []) => {
  return userIds.map((userId) => generateMockDeliveryPerson(userId));
};

module.exports = {
  generateMockDeliveryPerson,
  generateMockDeliveryPersons
};