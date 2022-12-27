require("dotenv").config();

const mongoUrl =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_PROD
    : process.env.MONGO_DEV;

const allowedOrigins = [/.*./];

if (process.env.NODE_ENV === "development") {
  allowedOrigins.push(
    /localhost/,
    "https://postwoman.io",
    /127.0.0.1/,
    /swagger.local/
  );
}

/**
 * @function cors
 *
 * Express middleware that allows customization with its origin
 * @param req
 * @param res
 * @param next
 */
const cors = (req, res, next) => {
  const requestHost = req.get("origin") || req.get("host");
  if (allowedOrigins.some((origin) => requestHost.match(origin))) {
    res.header("Access-Control-Allow-Origin", req.get("origin"));
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  next();
};

module.exports = {
  mongoUrl,
  cors
};
