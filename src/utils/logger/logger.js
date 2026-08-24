const winston = require("winston");

const { mkdirSync, existsSync } = require("node:fs");
const { join } = require("node:path");

const envConfig = require("../../config/env.config.js");

console.log("ENV CONFIG:", envConfig);

const {
    isProd,
    logLevel
} = envConfig;

const {
    combinedTransport,
    errorTransport
} = require("../../utils/logger/transports-reference.js");

const logsDir = join(__dirname, "..", "..", "..", "logs");

// Crear carpeta logs si no existe
if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
}

// Niveles personalizados
const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },

    colors: {
        fatal: "magenta",
        error: "red",
        warning: "yellow",
        info: "green",
        http: "cyan",
        debug: "gray"
    }
};

winston.addColors(customLevels.colors);

// Formato base
const baseFormat = winston.format.combine(
    winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.errors({
        stack: true
    })
);

// Formato de consola
const consoleFormat = isProd
    ? winston.format.json()
    : winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf((info) => {

            const {
                timestamp,
                level,
                message,
                stack,
                ...meta
            } = info;

            const tail = Object.keys(meta).length
                ? ` ${JSON.stringify(meta)}`
                : "";

            const stackTail = stack
                ? `\n${stack}`
                : "";

            return `${timestamp} [${level}] ${message}${tail}${stackTail}`;
        })
    );


// Crear logger
const logger = winston.createLogger({
    levels: customLevels.levels,

    // development → debug
    // production → info
    level: logLevel,

    format: baseFormat,

    transports: [
        // Consola
        new winston.transports.Console({
            format: consoleFormat
        }),

        // Archivo general
        combinedTransport,

        // Solo error y fatal
        errorTransport
    ]
});

module.exports = logger;