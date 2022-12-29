const joi = require("joi");

const createUserScheme = joi.object({
  first_name: joi.string().min(3).required(),
  last_name: joi.string().min(3).required(),
  birthday: joi.string().min(3).required(),
  location: joi.string().min(3).required(),
  type: joi.string().min(3).required(),
});

module.exports = {
  createUserScheme,
};
