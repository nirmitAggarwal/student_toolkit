import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod = null;

const connectDatabase = async () => {
  let uri = process.env.MONGODB_URI;

  if (process.env.NODE_ENV === "test") {
    console.log("Starting in-memory MongoDB...");
    mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
  }

  if (!uri) {
    throw new Error("MONGODB_URI is not defined.");
  }

  mongoose.set("strictQuery", false);

  await mongoose.connect(uri);

  console.log("MongoDB connected");
};

process.on("SIGTERM", async () => {
  if (mongod) await mongod.stop();
  await mongoose.disconnect();
});

export default connectDatabase;
