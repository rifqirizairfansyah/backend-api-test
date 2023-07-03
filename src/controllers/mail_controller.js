const mailService = require("../services/mail_service");
const logger = require("../utils/logger");
const {
  requestResponse
} = require("../utils");

let response;

const sendMail = async (req, res) => {
  const { first_name, last_name, type } = req.body;
  try {
    const mail = await mailService.sendMail({
      FIRST_NAME: first_name,
      LAST_NAME: last_name,
      TYPE: type
    });

    response = { ...mail };
  } catch (error) {
    logger.error(error);

    response = { ...requestResponse.server_error };
  }

  res.status(response.code).json(response);
};

module.exports = {
  sendMail
};