import mongoose from "mongoose";

require("dotenv").config();

const dbUrl: string = process.env.DATABASE_URL || "";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(dbUrl);
    console.log(
      `Database is connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Error while connecting database", error);
    process.exit(1);
  }
};

export default connectDb;
