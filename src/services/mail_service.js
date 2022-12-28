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
  const { FIRST_NAME, LAST_NAME, TYPE } = profile
  try {   
    instance.post('/send-email', { emai: `rifqibatch@gmail.com`, message: `Hey, ${FIRST_NAME} ${LAST_NAME} it’s your ${TYPE}! ` })
    return { ...requestResponse.success };
  } catch (error) {
    return { ...requestResponse.server_error };
  }
};

module.exports = {
  sendMail
};