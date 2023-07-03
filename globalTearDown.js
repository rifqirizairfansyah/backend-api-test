// globalTeardown.js
const mongo = require("./src/database/mongo");
const {closeConnection} = require("./src/queque/order-queue");

async function globalTeardown() {
  await closeConnection();
}

module.exports = globalTeardown;
