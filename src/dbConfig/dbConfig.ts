import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
    if (
        isConnected &&
        mongoose.connection.readyState === 1
    ) {
        return mongoose.connection;
    }

    try {
        console.log(
            "Mongo URL exists:",
            !!process.env.MONGO_URL
        );

        const connection = await mongoose.connect(
            process.env.MONGO_URL!,
            {
                serverSelectionTimeoutMS: 10000,
            }
        );

        isConnected = true;

        console.log(
            "MongoDB Connected:",
            connection.connection.host
        );

        console.log(
            "Database Name:",
            connection.connection.db?.databaseName
        );

        return connection;

    } catch (error) {
        isConnected = false;

        console.error(
            "MongoDB connection failed:",
            error
        );

        throw error;
    }
}