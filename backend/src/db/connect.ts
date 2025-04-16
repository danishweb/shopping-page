import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/karini-ai";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = !!db.connections[0].readyState;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);

    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }

    throw error;
  }
};
