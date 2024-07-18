import mongoose from "mongoose";
const dbConnection = async () => {
  await mongoose.connect(process.env.MONGO_URL, { dbName: "PORTFOLIO" });
};

export default dbConnection;
