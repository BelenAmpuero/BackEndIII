const User = require("../models/user.model");

class UserRepository {

    async insertMany(users) {
        return await User.insertMany(users);
    }


    async getAll(criteria = {}, options = {}) {

        const {
            role,
            search
        } = criteria;

        const {
            page = 1,
            limit = 10,
            sort = { createdAt: -1 }
        } = options;

        const filter = {};

        if (role) {
            filter.role = role;
        }

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        const skip = (page - 1) * limit;

        const users = await User.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalDocs = await User.countDocuments(filter);

        const totalPages = Math.ceil(totalDocs / limit);

        return {
            docs: users,
            totalDocs,
            limit: Number(limit),
            page: Number(page),
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
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