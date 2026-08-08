const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "Shipnow",
    });

    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    process.exit(1);
  }
};

module.exports = connectDB;