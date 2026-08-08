const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const { ROLES } = require("../utils/constants.js");
const mongoose = require("mongoose");

const hashedPassword = bcrypt.hashSync("coder123", 10);

const generateMockUser = () => {
  return {
    _id: new mongoose.Types.ObjectId(),

    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: hashedPassword,
    role: faker.helpers.arrayElement(Object.values(ROLES)),
    phone: faker.phone.number(),
    address: faker.location.streetAddress()
  };
};

const generateMockUsers = (qty = 1) => {
  return Array.from({ length: qty }, generateMockUser);
};

module.exports = {
  generateMockUser,
  generateMockUsers
};