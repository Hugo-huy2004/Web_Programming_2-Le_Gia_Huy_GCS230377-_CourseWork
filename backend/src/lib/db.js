import mongoose from "mongoose";
import { env } from "../config/env.js";

const connectDB = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(env.mongoUri);
        console.log("Database connected!")
    } catch (err) {
        console.error("Error while connecting to Database: ", err.message);
        process.exit(1);
    }
}

export default connectDB;
