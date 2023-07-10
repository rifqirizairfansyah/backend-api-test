const User = require("../models/user_model");
const { getTime } = require("date-fns");
const { requestResponse, toTitleCase } = require("../utils");
const { createEvent, deleteEvent } = require("./aws/aws-scheduler");

const scheduleEvent = async (
  first_name,
  birthday,
  location,
  type
) => {
    const date = getTime(new Date(birthday));
    return await createEvent(first_name, date, location, type);
};

const deleteScheduleEvent = async (
  events
) => {
  try {

    for (const event of events) {
      await deleteEvent(event.ID_SCHEDULER_EVENT);
    }
    
    return { ...requestResponse.success };
  } catch (error) {
    return { ...requestResponse.unprocessable_entity };
  }
};

module.exports = {
  scheduleEvent,
  deleteScheduleEvent
};
