import mongoose from "mongoose";

export async function dbConnects() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("db connects......");
  } catch (error) {
    console.log("Error happens in server or database connection");
  }
}
