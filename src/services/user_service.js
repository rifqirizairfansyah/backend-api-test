const User = require("../models/user_model");
const { getTime } = require("date-fns");
const { requestResponse, toTitleCase } = require("../utils");
const { createNewOrder } = require("../queque/order-queue")

let response;
/**
 * @function registerUser
 * Register an user
 * @param {String} email, password, name
 * @returns {Promise<{code: number, message: string, status: boolean}>}
 */
const registerUser = async (first_name, last_name, birthday, location) => {

  const user = await findUserByFirstnameOrLastname(first_name, last_name);

  if (user !== null) {
    response = { ...requestResponse.unprocessable_entity };
    response.message = "E-mail already registered";

    return response;
  }

  const date = getTime(new Date(birthday))
  const payload = {
    FIRST_NAME: first_name,
    LAST_NAME: last_name,
    BIRTHDAY: date,
    LOCATION: location,
  };

  await User.create(payload);
  await createNewOrder(payload, location, date)
  return { ...requestResponse.success };
};

/**
 * @function findUserByEmail
 * Find an user by its email
 * @param {String} email
 * @returns {Promise<Document>}
 */
const findUserByFirstnameOrLastname = async (first_name, last_name) => {
  const user = await User.findOne(
    {
      $and: [
        { FIRST_NAME: first_name },
        { LAST_NAME: last_name }
      ]
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
const deleteUser = (conditions) => {
  return User.deleteOne(conditions);
};


module.exports = {
  registerUser,
  deleteUser
};
