const { SchedulerClient, CreateScheduleCommand } = require("@aws-sdk/client-scheduler");
const { getDate, getMonth, parseISO } = require("date-fns");
const logger = require("../utils/logger");

const client = new SchedulerClient({ region: "us-east-1" });

const createBirthdayRule = async (firstName, birthday, timezone) => {
  const date = new Date(birthday);
  const ruleName = `birthday_${firstName}`;
  const cronExpression = `0 9 ${getDate(date)} ${getMonth(date) + 1} ? *`;

  const rule = {
    Name: ruleName,
    ScheduleExpression: `cron(${cronExpression})`,
    State: "ENABLED",
    Description: `Send birthday email to user ${firstName} at 9 AM in their timezone`,
    Target: {
      Id: "birthday-email-target",
      Arn: "arn:aws:sqs:us-east-1:452999660372:email_queue",
      Input: JSON.stringify({ 
          first_name: firstName,
          last_name: firstName,
          type: 'Birthday'
       }),
      RoleArn: 'arn:aws:iam::452999660372:role/EventSchedullerEmail'
    },
    ScheduleExpressionTimezone: timezone,
    FlexibleTimeWindow: {
      Mode: "OFF"
    }
  };

    const command = new CreateScheduleCommand(rule);
    await client.send(command);
    logger.info(
      `Success Create Scheduller`
    );
};


module.exports = {
  createBirthdayRule
}