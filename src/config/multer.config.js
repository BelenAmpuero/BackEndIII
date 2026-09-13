const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==========================================
// UPLOAD DIRECTORIES
// ==========================================

const uploadPath = path.join(
    __dirname,
    "../../uploads"
);

const userDocumentsPath = path.join(
    uploadPath,
    "users",
    "documents"
);

const deliveryReceiptsPath = path.join(
    uploadPath,
    "deliveries",
    "receipts"
);


// ==========================================
// CREATE DIRECTORIES
// ==========================================

fs.mkdirSync(userDocumentsPath, {
    recursive: true
});

fs.mkdirSync(deliveryReceiptsPath, {
    recursive: true
});


// ==========================================
// ALLOWED FILE TYPES
// ==========================================

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf"
];


// ==========================================
// FILE FILTER
// ==========================================

const fileFilter = (req, file, cb) => {

    if (!allowedMimeTypes.includes(file.mimetype)) {

        const error = new Error("INVALID_FILE_TYPE");

        return cb(error);
    }

    cb(null, true);
};


// ==========================================
// STORAGE FACTORY
// ==========================================

const createStorage = (destinationPath) => {

    return multer.diskStorage({

        destination: (req, file, cb) => {

            cb(null, destinationPath);
        },

        filename: (req, file, cb) => {

            const uniqueSuffix =
                `${Date.now()}-${Math.round(Math.random() * 1E9)}`;

            const extension =
                path.extname(file.originalname);

            const filename =
                `${file.fieldname}-${uniqueSuffix}${extension}`;

            cb(null, filename);
        }
    });
};


// ==========================================
// MULTER CONFIGURATION
// ==========================================

const uploadUserDocument = multer({

    storage: createStorage(userDocumentsPath),

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


const uploadDeliveryReceipt = multer({

    storage: createStorage(deliveryReceiptsPath),

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


module.exports = {
    uploadUserDocument,
    uploadDeliveryReceipt,
    allowedMimeTypes,
    userDocumentsPath,
    deliveryReceiptsPath
};