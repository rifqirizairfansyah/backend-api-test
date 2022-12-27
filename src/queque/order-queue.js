require("dotenv").config();
const Queque = require('bull')
const { ordersProcess, handlerCompleted, handlerFailure, handlerStalled } = require("./order-queque-consumer")
const { format, getTimezoneOffset } = require("date-fns-tz");
const { getDate, getMonth } = require("date-fns");

const orderQueue = new Queque("email", {
  redis: process.env.REDIS_URL
})


orderQueue.process(ordersProcess)
orderQueue.on('failed', handlerFailure);
orderQueue.on('completed', handlerCompleted);
orderQueue.on('stalled', handlerStalled);

/**
 * @function createNewOrder
 * Create new order and send to Redis
 * when making an order fails, it will be retried 3 times in the next 1 hour
 * @param {String} user, timezone, date
 * @returns {Promise<{code: number, message: string, status: boolean}>}
 */

const createNewOrder = (user, timezone, date) => {
  const offsetZone = getTimezoneOffset(timezone)
  const day = getDate(date)
  const month = getMonth(date) + 1

  orderQueue.add({
    user,
    timezone,
    date
  }, {
    attempts: 3,
    backoff: 3600000, 
    removeOnFail: false,
    repeat: { 
      cron: `00 09 ${day} ${month} *`,
      offset: offsetZone,
      tz: timezone
    }
  });
};

module.exports = {
  createNewOrder
}