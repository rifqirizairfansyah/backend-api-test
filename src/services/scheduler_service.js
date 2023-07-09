const User = require("../models/user_model");
const { getTime } = require("date-fns");
const { requestResponse, toTitleCase } = require("../utils");
const { createEvent, deleteEvent } = require("../queque/aws-scheduler");

const scheduleEvent = async (
  first_name,
  birthday,
  location
) => {
  try {
    const date = getTime(new Date(birthday));
    await createEvent(first_name, date, location);
    
    return { ...requestResponse.success };
  } catch (error) {
    return { ...requestResponse.unprocessable_entity };
  }
};

const deleteScheduleEvent = async (
  first_name
) => {
  try {
    await deleteEvent(first_name);
    
    return { ...requestResponse.success };
  } catch (error) {
    return { ...requestResponse.unprocessable_entity };
  }
};

module.exports = {
  scheduleEvent,
  deleteScheduleEvent
};
