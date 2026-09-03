const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userRepository = require("../repositories/users.repository");
const AppError = require("../utils/errors/appError");
const logger = require("../utils/logger/logger");

const getUsers = async (req, res, next) => {
    try {
        const { page, limit, role, search } = req.query;

        // 1. Construir el objeto de filtros dinámico
        const filter = {};

        if (role) {
            filter.role = role; // Ejemplo: ?role=admin
        }

        if (search) {
            // Búsqueda insensible a mayúsculas/minúsculas en el nombre o email
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        // 2. Definir opciones de paginación
        const options = {
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 10
        };

        // 3. Llamar al repositorio
        const result = await userRepository.getAll(filter, options);

        res.json({
            status: "success",
            payload: result.docs,
            pagination: {
                totalDocs: result.totalDocs,
                limit: result.limit,
                page: result.page,
                totalPages: result.totalPages,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            }
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