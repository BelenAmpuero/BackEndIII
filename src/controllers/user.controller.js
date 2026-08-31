const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userRepository = require("../repositories/users.repository");
const AppError = require("../utils/errors/appError");
const logger = require("../utils/logger/logger");

const getUsers = async (req, res, next) => {

    try {

        const users = await userRepository.getAll();

        res.json({
            status: "success",
            payload: users
        });

    } catch (error) {

        next(error);

    }
};


const getUserById = async (req, res, next) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("INVALID_USER_DATA");
        }

        const user = await userRepository.getById(id);

        if (!user) {
            throw new AppError("USER_NOT_FOUND");
        }

        res.json({
            status: "success",
            payload: user
        });

    } catch (error) {

        next(error);

    }
};


const createUser = async (req, res, next) => {

    try {

        const {
            name,
            email,
            password,
            role,
            phone,
            address
        } = req.body;

        if (!name || !email || !password) {
            throw new AppError("INVALID_USER_DATA");
        }

        const existingUser = await userRepository.getByEmail(
    email.toLowerCase()
);

        if (existingUser) {
            throw new AppError("USER_ALREADY_EXISTS");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userRepository.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            phone,
            address
        });

        logger.info(`Usuario creado correctamente: ${user._id}`);

        res.status(201).json({
            status: "success",
            payload: user
        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    getUsers,
    getUserById,
    createUser
};