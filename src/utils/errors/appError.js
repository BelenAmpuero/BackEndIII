const ERROR_CODES = require("./errorsDictionary.js");

class AppError extends Error {
    constructor(code) {
        const error = ERROR_CODES[code];

        if (!error) {
            throw new Error(`Unknown error code: ${code}`);
        }

        super(error.message);

        this.code = code;
        this.status = error.status;
    }
}

module.exports = AppError;