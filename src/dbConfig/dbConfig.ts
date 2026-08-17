import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL!;

if (!MONGO_URL) {
  throw new Error("MONGO_URL is not defined in .env");
}

export async function connect() {
  try {
    // Already connected
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return;
    }

    const connection = await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      "MongoDB Connected:",
      connection.connection.host
    );

    console.log(
      "Database Name:",
      connection.connection.name
    );

  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}