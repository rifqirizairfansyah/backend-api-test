const { instance } = require('../utils/axios')
const { requestResponse } = require("../utils");

let response;
/**
 * @function sendMail
 * Send a mail
 * @param {String} fullname
 * @returns {Promise<{code: number, message: string, status: boolean}>}
 */
const sendMail = async (profile) => {
  const { FIRST_NAME, LAST_NAME } = profile
  instance.post('/send-email', { email: `rifqibatch@gmail.com`, message: `Hey, ${FIRST_NAME} ${LAST_NAME} it’s your birthday!` })
  return { ...requestResponse.success };
};

module.exports = {
  sendMail
};