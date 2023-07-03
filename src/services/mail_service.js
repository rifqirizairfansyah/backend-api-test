const { instance } = require("../utils/axios");
const { requestResponse } = require("../utils");
const nodemailer = require('nodemailer');
require("dotenv").config();

let response;
/**
 * @function sendMail
 * Send a mail
 * @param {String} fullname
 * @returns {Promise<{code: number, message: string, status: boolean}>}
 */
const sendMail = async (profile) => {
  const { FIRST_NAME, LAST_NAME, TYPE } = profile;
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
  });
  
  try {
    await transporter.sendMail({
      from: `erin@gmail.com`,
      to: `${FIRST_NAME}@gmail.com`,
      subject: `Hey this is your ${TYPE}`,
      text: `Hello ${FIRST_NAME} ${LAST_NAME}!.`,
    });

    return { ...requestResponse.success };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  sendMail,
};
