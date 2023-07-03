require("dotenv").config();
const { mongoUrl } = require("../config");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

/**
 * @function createConnection
 *
 * Create MongoDB connection. Configs are supplied automatically in the method
 * @returns {Promise<void>}
 */
const createConnection = async () => {
  await mongoose.connect(mongoUrl);
};

const closedConnectionMongo = async () => {
  await mongoose.disconnect();
};

module.exports = {
  createConnection,
  closedConnectionMongo,
  connection: mongoose.connection
};
