const mongoose = require("mongoose");

const connectToDb = async () => {
  await mongoose.connect(
    "mongodb+srv://kaushalrijal091:souljaboy@cluster0.rq4l04j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    console.log("Database connected")
  );
};

module.exports = connectToDb;