const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userRepository = require("../repositories/users.repository");
const AppError = require("../utils/errors/appError");

const { PAGINATION } = require("../utils/constants");

class UserService {

    async getUsers(query) {

        const { page, limit, role, search } = query;

        const pageNumber = Math.max(
            parseInt(page, 10) || PAGINATION.DEFAULT_PAGE,
            1
        );

        const limitNumber = Math.min(
            Math.max(
                parseInt(limit, 10) || PAGINATION.DEFAULT_LIMIT,
                1
            ),
            PAGINATION.MAX_LIMIT
        );

        const options = {
            page: pageNumber,
            limit: limitNumber
        };

        return await userRepository.getAll(
            { role, search },
            options
        );
    }

    async getUserById(id) {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("INVALID_USER_DATA");
        }

        const user = await userRepository.getById(id);

        if (!user) {
            throw new AppError("USER_NOT_FOUND");
        }

        return user;
    }


    async createUser(userData) {

        const {
            name,
            email,
            password,
            role,
            phone,
            address
        } = userData;

        if (!name || !email || !password) {
            throw new AppError("INVALID_USER_DATA");
        }

        const normalizedEmail = email.toLowerCase();

        const existingUser = await userRepository.getByEmail(
            normalizedEmail
        );

        if (existingUser) {
            throw new AppError("USER_ALREADY_EXISTS");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        return await userRepository.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role,
            phone,
            address
        });
    }
}

module.exports = new UserService();