const uploadService = require("../services/upload.service");

const createUserDocument = async (req, res, next) => {

    try {

        const { id } = req.params;
        const { documentType } = req.body;

        console.log("FILE:", req.file);
console.log("BODY:", req.body);

        const result = await uploadService.createUserDocument(
            id,
            documentType,
            req.file
        );

        res.status(201).json({
            status: "success",
            payload: result
        });

    } catch (error) {

        next(error);

    }
};

module.exports = {
    createUserDocument
};