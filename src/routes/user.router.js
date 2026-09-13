const { Router } = require("express");

const {
    uploadUserDocument
} = require("../config/multer.config");

const uploadErrorHandler = require("../middlewares/uploadError.middleware");

const {
    getUsers,
    getUserById,
    createUser
} = require("../controllers/user.controller");

const {
    createUserDocument
} = require("../controllers/document.controller");

const router = Router();

router.get("/", getUsers);

router.get("/:id", getUserById);

router.post("/", createUser);

router.post(
    "/:id/documents",
    uploadErrorHandler(
        uploadUserDocument.single("file")
    ),
    createUserDocument
);

module.exports = router;