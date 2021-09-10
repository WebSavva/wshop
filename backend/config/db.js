const colors = require("colors");
const mongoose = require("mongoose");

async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_DB_LINK);

    console.log("The connection to MongoDB has been established".bgGreen.white);
  } catch (error) {
    console.log(
      `The connection failed. Reason: ${error.message}`.bgRed.white.underline
    );
    process.exit(1);
  }
}

module.exports = connectDB;
