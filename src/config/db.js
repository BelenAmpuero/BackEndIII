const mongoose = require("mongoose");
const logger = require("../utils/logger/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    logger.info("✅ MongoDB conectado");
  } catch (error) {
    logger.fatal(`❌ Error de conexión: ${error.message}`,{
      stack: error.stack
    });
    process.exit(1);
  }
};

module.exports = connectDB;