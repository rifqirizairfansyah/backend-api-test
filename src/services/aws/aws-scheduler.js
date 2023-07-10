const { SchedulerClient, CreateScheduleCommand, DeleteScheduleCommand } = require("@aws-sdk/client-scheduler");
const { getDate, getMonth, parseISO } = require("date-fns");
const logger = require("../../utils/logger");
const { v4: uuidv4 } = require('uuid');

const client = new SchedulerClient({ region: "us-east-1" });

const createEvent = async (firstName, birthday, timezone, type) => {
  const uniqueId = uuidv4();
  const date = new Date(birthday);
  const ruleName = `${type}_${uniqueId}`;
  const cronExpression = `0 9 ${getDate(date)} ${getMonth(date) + 1} ? *`;

  const rule = {
    Name: ruleName,
    ScheduleExpression: `cron(${cronExpression})`,
    State: "ENABLED",
    Description: `Send ${type} email to user ${firstName} at 9 AM in their timezone`,
    Target: {
      Id: uniqueId,
      Arn: "arn:aws:events:us-east-1:452999660372:event-bus/default",
      EventBridgeParameters: {
        DetailType: "email",
        Source: "myapp.erin",
      },
      Input: JSON.stringify({ 
          first_name: firstName,
          last_name: firstName,
          type: type
       }),
      RoleArn: 'arn:aws:iam::452999660372:role/EventScheduleRole'
    },
    ScheduleExpressionTimezone: timezone,
    FlexibleTimeWindow: {
      Mode: "OFF"
    }
  };

    const command = new CreateScheduleCommand(rule);
    await client.send(command);
    logger.info(
      `Success Create Scheduler`
    );

    return ruleName
};

const deleteEvent = async (event) => {
  const ruleName = event;
  const command = new DeleteScheduleCommand({
    Name: ruleName,
  });

  try {
    await client.send(command);
    logger.info(`Success deleting the scheduler with rule name ${ruleName}`);
  } catch (error) {
    logger.error(`Error deleting the scheduler: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createEvent,
  deleteEvent
}