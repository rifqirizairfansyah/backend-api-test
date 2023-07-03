const User = require("../models/user_model");
const { getTime } = require("date-fns");
const { requestResponse, toTitleCase } = require("../utils");
const { createNewOrder, removeOrder } = require("../queque/order-queue");
const { createBirthdayRule } = require("../queque/aws-scheduller");

const scheduleEvent = async (
  first_name,
  birthday,
  location
) => {
  try {
    const date = getTime(new Date(birthday));
    await createBirthdayRule(first_name, date, location);
    
    return { ...requestResponse.success };
  } catch (error) {
    return { ...requestResponse.unprocessable_entity };
  }
};

module.exports = {
  scheduleEvent
};
