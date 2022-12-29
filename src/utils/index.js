require("dotenv").config();
const logger = require("./logger");

/**
 * @function toTitleCase
 * Transform supplied string to title case
 * @param {String} string
 * @returns {String}
 */
const toTitleCase = (string) => {
  return string
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(" ");
};

/**
 * @function checkRequest
 * This method is used in express middleware. It will check the incoming request with required request.
 * @param {Object} requiredRequest
 * @returns {function(...[*]=)}
 */
const checkRequest = (requiredRequest) => {
  return async (req, res, next) => {
    let valid = true;

    for (const type in requiredRequest) {
      if (type === "file") {
        if (!(req.file.fieldname === requiredRequest[type])) {
          if (process.env.NODE_ENV !== "production") {
            logger.info("Missing 'file' field");
          }
          valid = false;
        }
      } else {
        requiredRequest[type].forEach((parameterName) => {
          if (!(parameterName in req[type])) {
            if (process.env.NODE_ENV !== "production") {
              logger.info(`Missing ${parameterName} field`);
            }
            valid = false;
          }
        });
      }
    }

    if (!valid) {
      res
        .status(requestResponse.incomplete_body.code)
        .json(requestResponse.incomplete_body);
    } else {
      next();
    }
  };
};

/**
 * @function checkReqeuiredProperties
 * This method is an alternative method from checkRequest, but can be used more universal, not limited only to express middleware.
 * @param {Object} requiredProperties
 * @param {Object} properties
 * @returns {boolean}
 */
const checkRequiredProperties = (requiredProperties, properties) => {
  let valid = true;

  for (const type in requiredProperties) {
    requiredProperties[type].forEach((parameterName) => {
      if (!(parameterName in properties[type])) {
        if (process.env.NODE_ENV !== "production") {
          logger.info(`Missing ${parameterName} field`);
        }
        valid = false;
      }
    });
  }

  return valid;
};

const requiredRequest = {
  users_register: {
    body: ["first_name", "last_name", "birthday", "location", "type"],
  },
};

const requestResponse = {
  success: {
    code: 200,
    status: true,
    message: "Success.",
  },
  incomplete_body: {
    code: 400,
    status: false,
    message: "Bad request. Please check your request data.",
  },
  unauthorized: {
    code: 401,
    status: false,
    message:
      "E-mail or password does not match, or you are not authorized to accessing this page.",
  },
  not_found: {
    code: 404,
    status: false,
    message: "Resource not found",
  },
  unprocessable_entity: {
    code: 422,
    status: false,
    message: "The request you sent is unable to process",
  },
  server_error: {
    code: 500,
    status: true,
    message: "Internal server error. Please contact the administrator.",
  },
};

module.exports = {
  checkRequest,
  toTitleCase,
  checkRequiredProperties,
  requestResponse,
  requiredRequest,
};
