import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const response = await mongoose.connect(
      `${process.env.MONGODB_URI}/techkart`
    );
    console.log(
      `MongoDB Connected: ${response.connection.host}/${response.connection.name}`
    );
    return response;
  } catch (error) {
    throw error;
  }
}
