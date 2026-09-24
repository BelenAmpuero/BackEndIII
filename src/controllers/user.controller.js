const userService = require("../services/user.service");
const logger = require("../utils/logger/logger");


const getUsers = async (req, res, next) => {
    try {

        const result = await userService.getUsers(req.query);

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

        const user = await userService.getUserById(req.params.id);

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

        const user = await userService.createUser(req.body);

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