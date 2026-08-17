import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connect() {
    try {
        console.log("Mongo URL exists:", !!process.env.MONGO_URL);

        const connection = await mongoose.connect(
            process.env.MONGO_URL!
        );

        console.log(
            "MongoDB Connected:",
            connection.connection.host
        );

    } catch (error) {
        console.log("MongoDB is not Connected");
        console.error(error);
        process.exit(1);
    }
}