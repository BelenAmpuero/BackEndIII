const { faker } = require("@faker-js/faker");
const { DELIVERY_STATUS } = require("../utils/constants.js");


const generateMockDelivery = (orderId, deliveryPersonId) => {
  return {
    order: orderId,

    deliveryPerson: deliveryPersonId,

    status: faker.helpers.arrayElement(
      Object.values(DELIVERY_STATUS)
    ),

    assignedAt: faker.date.recent()
  };
};


const generateMockDeliveries = (orders = [], deliveryPersons = []) => {
  return orders.map((order, index) => {
    return generateMockDelivery(
      order._id,
      deliveryPersons[index]._id
    );
  });
};


module.exports = {
  generateMockDelivery,
  generateMockDeliveries
};