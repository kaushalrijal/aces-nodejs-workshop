const mongoose = require("mongoose");

const connectToDb = async () => {
  await mongoose.connect(
    process.env.CONNECTION_URL,
    console.log("Database connected")
  );
};

module.exports = connectToDb;