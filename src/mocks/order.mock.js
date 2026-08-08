const { faker } = require("@faker-js/faker");
const { ORDER_STATUS, ORDER_PRIORITY } = require("../utils/constants.js");
const mongoose = require ("mongoose");

const generateItems = () => {
    const quantityItems = faker.number.int({
        min: 1,
        max: 5
    });

    return Array.from({ length: quantityItems }, () => ({
        product: faker.commerce.productName(),
        quantity: faker.number.int({
            min: 1,
            max: 5
        }),
        price: Number(
            faker.commerce.price({
                min: 500,
                max: 10000
            })
        )
    }));
};


const calculateTotal = (items) => {
    return items.reduce(
        (total, item) => total + (item.quantity * item.price),
        0
    );
};


const generateMockOrder = (userId) => {

    const items = generateItems();

    return {
        _id: new mongoose.Types.ObjectId(),

        user: userId,

        items,

        total: calculateTotal(items),

        deliveryAddress: faker.location.streetAddress(),

        status: faker.helpers.arrayElement(
            Object.values(ORDER_STATUS)
        ),

        priority: faker.helpers.arrayElement(
            Object.values(ORDER_PRIORITY)
        )
    };
};


const generateMockOrders = (userIds = []) => {
    return userIds.map(userId =>
        generateMockOrder(userId)
    );
};


module.exports = {
    generateMockOrder,
    generateMockOrders
};