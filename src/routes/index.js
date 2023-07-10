const express = require("express");
const router = express.Router();

const userController = require("../controllers/user_controller");
const validationObject = require("../utils/validation_object");
const { validateExpress } = require("../middlewares/validator");
const { checkRequest, requiredRequest } = require("../utils");

router.post(
  "/users",
  checkRequest(requiredRequest.users_register),
  validateExpress(validationObject.createUserScheme),
  userController.create
);

router.delete("/users/:id", userController.destroy);

module.exports = router;
