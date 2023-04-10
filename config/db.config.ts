import mongoose from "mongoose";

export async function connectToDB() {
  try {
    mongoose.set("strictQuery", false);
    if (process.env.MONGODB_URI) {
      const dbConnect = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`Connected to db: ${dbConnect.connection.name}`);
    } else {
      console.log("No MongoDB URI found");
    }
  } catch (err) {
    console.log(err);
  }
}
