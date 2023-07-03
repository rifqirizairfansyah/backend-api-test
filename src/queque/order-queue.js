require("dotenv").config();
const logger = require("../utils/logger");
const Queque = require("bull");
const {
  ordersProcess,
  handlerCompleted,
  handlerFailure,
  handlerStalled,
} = require("./order-queue-consumer");
const { format, getTimezoneOffset } = require("date-fns-tz");
const { getDate, getMonth } = require("date-fns");

const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
};

const orderQueue = new Queque("email", redisConfig);

orderQueue.process(ordersProcess);
orderQueue.on("failed", handlerFailure);
orderQueue.on("completed", handlerCompleted);
orderQueue.on("stalled", handlerStalled);

/**
 * @function createNewOrder
 * Create new order and send to Redis
 * when making an order fails, it will be retried 3 times in the next 1 hour
 * @param {String} user, timezone, date
 * @returns {Promise<{code: number, message: string, status: boolean}>}
 */

const createNewOrder = async (user, timezone, date, id) => {
  const offsetZone = getTimezoneOffset(timezone);
  const day = getDate(date);
  const month = getMonth(date) + 1;

  
  await orderQueue.add(
    {
      user,
      timezone,
      date,
    },
    {
      jobId: id,
      attempts: 3,
      backoff: 3600000,
      removeOnComplete: true,
      removeOnFail: false,
      repeat: {
        cron: `00 09 ${day} ${month} *`,
        offset: offsetZone,
        tz: timezone,
      },
    }
  );
};

const removeOrder = async (key) => {
  const repeatableJobs = await orderQueue.getRepeatableJobs();
  const jobWithId = repeatableJobs.filter((job) => job.key.includes(key))[0];
  if (jobWithId) await orderQueue.removeRepeatableByKey(jobWithId.key);
};

const closeConnection = async (key) => {
  return await orderQueue.close();
}

module.exports = {
  createNewOrder,
  removeOrder,
  closeConnection
};
