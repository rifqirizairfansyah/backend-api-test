const userService = require("../services/user_service");
const schedulerService = require("../services/scheduller_service");
const logger = require("../utils/logger");
const {
  requestResponse
} = require("../utils");

let response;

const create = async (req, res) => {
  const { first_name, last_name, birthday, location, type } = req.body;
  try {
    schedulerService.scheduleEvent(first_name, birthday, location)
    const user = await userService.registerUser(first_name, last_name, birthday, location, type);

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

    const deleteUser = await userService.deleteUser(conditions);

    response = { ...deleteUser };
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