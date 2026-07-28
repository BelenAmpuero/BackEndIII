import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    SESSION_SECRET: process.env.SESSION_SECRET
};

if (!config.MONGODB_URI) {
    throw new Error("Falta la variable MONGODB_URI");
}

export default config;