import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // ← must be first

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Atlas Connected Successfully ✅");
  } catch (error) {
    console.error("Database connection failed ❌");
    console.error(error.message);
    process.exit(1);// Exit process with failure
  }
};

export default connectDB;