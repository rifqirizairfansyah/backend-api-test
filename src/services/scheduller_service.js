const User = require("../models/user_model");
const { getTime } = require("date-fns");
const { requestResponse, toTitleCase } = require("../utils");
const { createBirthdayRule, deleteBirthdayRule } = require("../queque/aws-scheduller");

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

const deleteScheduleEvent = async (
  first_name
) => {
  try {
    await deleteBirthdayRule(first_name);
    
    return { ...requestResponse.success };
  } catch (error) {
    return { ...requestResponse.unprocessable_entity };
  }
};

module.exports = {
  scheduleEvent,
  deleteScheduleEvent
};
