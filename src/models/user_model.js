require("dotenv").config();

const mongoose = require("mongoose");
const collectionName = "users";

const userSchema = new mongoose.Schema(
  {
    FIRST_NAME: String,
    LAST_NAME: String,
    BIRTHDAY: String,
    LOCATION: String,
    TYPE: String
  },
  {
    versionKey: false,
    collection: collectionName
  }
);

module.exports = mongoose.model("users", userSchema);
