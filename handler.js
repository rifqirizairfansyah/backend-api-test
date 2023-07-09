'use strict';
const serverless = require('serverless-http');
const nodemailer = require('nodemailer');
const app = require('./src/app')

module.exports.api = serverless(app)

module.exports.mailer = async (event) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
  });
  console.log(event)
  try {
        await transporter.sendMail({
          from: `erin@gmail.com`,
          to: `${event.name}@gmail.com`,
          subject: `Hey this is your ${event.type}`,
          text: `${event.message}.`,
        });
    

    return {
      statusCode: 280
    }
  } catch (error) {
    throw new Error(error);
  }
};