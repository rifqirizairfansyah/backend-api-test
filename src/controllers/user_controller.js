const userService = require("../services/user_service");
const logger = require("../utils/logger");
const {
  requestResponse
} = require("../utils");

let response;

const create = async (req, res) => {
  const { first_name, last_name, birthday, location } = req.body;
  try {
    const user = await userService.registerUser(first_name, last_name, birthday, location);
    response = { ...user };
  } catch (error) {
    logger.error(error);

    response = { ...requestResponse.server_error };
  }

  res.status(response.code).json(response);
};

const destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const conditions = {
      _id: id
    };

    await userService.deleteUser(conditions);

    response = { ...requestResponse.success };
  } catch (error) {
    logger.error(error);
    response = { ...requestResponse.server_error };
  }

  res.status(response.code).json(response);
};

module.exports = {
  create,
  destroy
};