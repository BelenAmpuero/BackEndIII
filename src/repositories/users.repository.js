
const User = require("../models/user.model");

class UserRepository {

    async insertMany(users) {
        return await User.insertMany(users);
    }

    async getAll() {
        return await User.find();
    }

    async getById(id) {
        return await User.findById(id);
    }

    async getByEmail(email) {
        return await User.findOne({ email });
    }

    async create(userData) {
        return await User.create(userData);
    }

}

module.exports = new UserRepository();