const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const { join } = require("node:path");

const logsDir = join(__dirname, "..", "..", "..", "logs");

// Formato para archivos
const fileFormat = winston.format.combine(
    winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.json()
);

// Filtro: solamente error y fatal
const errorFilter = winston.format((info) => {
    return info.level === "error" || info.level === "fatal"
        ? info
        : false;
});

// Archivo general
const combinedTransport = new DailyRotateFile({
    filename: join(logsDir, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: fileFormat
});

// Archivo exclusivo de errores
const errorTransport = new DailyRotateFile({
    filename: join(logsDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: winston.format.combine(
        errorFilter(),
        fileFormat
    )
});

module.exports = {
    combinedTransport,
    errorTransport
};