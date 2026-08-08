const User = require("../models/user.model");

class UserRepository {

    async insertMany(users) {
        return await User.insertMany(users);
    }

    async getAll() {
        return await User.find();
    }

}

module.exports = new UserRepository();