const app = require("./app");
const connectDB = require("./config/db");
const { PORT } = require("./config/env.config");
const logger = require("./utils/logger/logger");


const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`🚀 Servidor escuchando en el puerto ${PORT}`);
  });
};

startServer();