const app = require("./app");
const connectDB = require("./config/db");
const { PORT } = require("./config/env.config");


const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
  });
};

startServer();