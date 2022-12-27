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