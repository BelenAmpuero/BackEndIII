  const { generateMockUsers } = require("../mocks/user.mock.js");

  const { generateMockOrders } = require("../mocks/order.mock.js");

  const { generateMockDeliveryPersons } = require("../mocks/deliveryPerson.mock.js");

  const { generateMockDeliveries } = require("../mocks/delivery.mock.js");

  const userRepository = require("../repositories/users.repository.js");
  const orderRepository = require("../repositories/order.repository.js");
  const deliveryPersonRepository = require("../repositories/deliveryPerson.repository.js");
  const deliveryRepository = require("../repositories/delivery.repository.js");

  const AppError = require("../utils/errors/appError.js");

const validateQuantity = (qty) => {
    if (!Number.isInteger(qty) || qty <= 0) {
        throw new AppError("INVALID_MOCK_QUANTITY");
    }
};

const validateUserIds = (userIds) => {
    if (!Array.isArray(userIds) || userIds.length === 0) {
        throw new AppError("MOCK_GENERATION_ERROR");
    }
};

const validateOrders = (orders) => {
    if (!Array.isArray(orders) || orders.length === 0) {
        throw new AppError("MOCK_GENERATION_ERROR");
    }
};

const validateDeliveryPersons = (deliveryPersons) => {
    if (!Array.isArray(deliveryPersons) || deliveryPersons.length === 0) {
        throw new AppError("MOCK_GENERATION_ERROR");
    }
};

  const generateUsers = (qty) => {
    validateQuantity(qty);
    return generateMockUsers(qty); };


  const generateOrders = (userIds) => {
    validateUserIds(userIds);
    return generateMockOrders(userIds);
  };


  const generateDeliveryPersons = (userIds) => {
    validateDeliveryPersons(userIds);
    return generateMockDeliveryPersons(userIds);
  };


  const generateDeliveries = (orders, deliveryPersons) => {
    validateOrders(orders);
    validateDeliveryPersons(deliveryPersons);
    return generateMockDeliveries(
      orders,
      deliveryPersons
    );
  };

  const generateSeedData = async (qty = 10) => {

  try{

  // 1. Usuarios
  const users = generateUsers(qty);
  const savedUsers = await userRepository.insertMany(users);

  const userIds = savedUsers.map(user => user._id);

  // 2. Pedidos
  const orders = generateOrders(userIds);
  const savedOrders = await orderRepository.insertMany(orders);

  // 3. Repartidores
  const deliveryPersons = generateDeliveryPersons(userIds);
  const savedDeliveryPersons =
    await deliveryPersonRepository.insertMany(deliveryPersons);

  // 4. Entregas
  const deliveries = generateDeliveries(
    savedOrders,
    savedDeliveryPersons
  );

  const savedDeliveries =
    await deliveryRepository.insertMany(deliveries);

  return {
    users: savedUsers.length,
    orders: savedOrders.length,
    deliveryPersons: savedDeliveryPersons.length,
    deliveries: savedDeliveries.length
  };
} catch (error) {

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("MOCK_DATABASE_ERROR");
    }
};

  module.exports = {
    generateUsers,
    generateOrders,
    generateDeliveryPersons,
    generateDeliveries,
    generateSeedData
  };