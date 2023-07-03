const User = require("../models/user_model");
const { getTime } = require("date-fns");
const { requestResponse, toTitleCase } = require("../utils");
const { createNewOrder, removeOrder } = require("../queque/order-queue");
const { createBirthdayRule } = require("../queque/aws-scheduller");

let response;
/**
 * @function registerUser
 * Register an user
 * @param {String} email, password, name
 * @returns {Promise<{code: number, message: string, status: boolean}>}
 */
const registerUser = async (
  first_name,
  last_name,
  birthday,
  location,
  type
) => {
  const user = await findUserByFirstnameAndLastname(first_name, last_name);

  if (user !== null) {
    response = { ...requestResponse.unprocessable_entity };
    response.message = "User already registered";

    return response;
  }

  const date = getTime(new Date(birthday));
  const payload = {
    FIRST_NAME: first_name,
    LAST_NAME: last_name,
    BIRTHDAY: date,
    LOCATION: location,
    TYPE: type,
  };

  await User.create(payload);
  const getId = await User.findOne(payload, {
    _id: true,
    FIRST_NAME: false,
    LAST_NAME: false,
    BIRTHDAY: false,
    LOCATION: false,
  });
  return { ...requestResponse.success };
};

/**
 * @function findUserByEmail
 * Find an user by its email
 * @param {String} email
 * @returns {Promise<Document>}
 */
const findUserByFirstnameAndLastname = async (first_name, last_name) => {
  const user = await User.findOne(
    {
      $and: [{ FIRST_NAME: first_name }, { LAST_NAME: last_name }],
    },
    { _id: false },
    { lean: true }
  );

  return user;
};

/**
 * @function deleteUser
 * Find an user by conditions
 * @param {String} conditions
 * @returns {Promise<Document>}
 */
const deleteUser = async (id) => {
  const user = await User.findOne({ _id: id });

  if (user === null) {
    response = { ...requestResponse.unprocessable_entity };
    response.message = "User not found";

    return response;
  }
  removeOrder(user._id);
  await User.deleteOne({ _id: user._id });

  return { ...requestResponse.success };
};

module.exports = {
  registerUser,
  deleteUser,
};
