const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const app = express();

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected");
      app.listen(process.env.PORT, () => {
        console.log(`server is running on port ${process.env.PORT}`);
      });
    })
    .catch(() => {
      console.log("connection failed");
    });
};

module.exports = connectDB;
