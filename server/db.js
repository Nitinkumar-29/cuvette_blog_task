const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongo = async () => {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/cuvette_task?retryWrites=true&w=majority"
    );
    console.log("Database connection established!");
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectToMongo;
